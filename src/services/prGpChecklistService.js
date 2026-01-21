import { supabase } from "./supabaseClient";
import { fetchPrGp } from "./prGpService";

export const syncPrGpToChecklist = async (payload) => {
    const gpItems = await fetchPrGp(payload);
    if (!gpItems || gpItems.length === 0) return [];

    console.log(`📥 Total data dari API: ${gpItems.length} rows`);

    // Ambil sample untuk header (semua row harusnya punya PR_Number yang sama dari filter)
    const headerSample = gpItems[0];
    const prNumber = headerSample.PR_Number?.trim();
    
    if (!prNumber) {
        throw new Error("PR Number tidak ditemukan");
    }

    // =========================
    // 1️⃣ CEK HEADER & ITEMS ADA ATAU TIDAK
    // =========================
    const { data: existingHeader } = await supabase
        .from("pr_gp_headers")
        .select("id")
        .eq("pr_number", prNumber)
        .single();

    // ✅ JIKA HEADER SUDAH ADA, LANGSUNG RETURN (TIDAK INSERT LAGI!)
    if (existingHeader) {
        console.log(`✅ PR ${prNumber} sudah ada di database, load existing data...`);
        
        const { data: checklist, error } = await supabase
            .from("pr_gp_items")
            .select("*")
            .eq("pr_gp_header_id", existingHeader.id)
            .order("item_desc");

        if (error) throw error;
        
        console.log(`📦 Loaded ${checklist.length} items dari database`);
        return checklist;
    }

    // 🆕 JIKA HEADER BELUM ADA, LANJUTKAN INSERT
    let headerId;

    // 🆕 HEADER BELUM ADA - INSERT BARU
    console.log(`🆕 Insert header PR ${prNumber}...`);
    
    const { data: newHeader, error: headerError } = await supabase
        .from("pr_gp_headers")
        .insert({
            pr_number: prNumber,
            pr_desc: headerSample.PR_Desc?.trim() || "",
            departement: headerSample.Departement?.trim() || "",
            site: headerSample.Site?.trim() || "",
            tahun: headerSample.Tahun || null,
            bulan: headerSample.Bulan || null,
        })
        .select()
        .single();

    if (headerError) {
        console.error("❌ Error insert header:", headerError);
        throw headerError;
    }

    headerId = newHeader.id;

    // =========================
    // 2️⃣ DEDUP ITEMS
    // Unique Key: ITEMNUMBER + Qty + PO_Number
    // =========================
    const uniqueItemsMap = new Map();
    
    gpItems.forEach((item) => {
        const itemNum = item.ITEMNUMBER?.trim();
        if (!itemNum) return;

        // 🔥 UNIQUE KEY: ITEMNUMBER + Qty + PO Number
        // Item dengan ITEMNUMBER sama tapi qty/PO beda = item berbeda
        const poNumber = item.PO_Number?.trim() || '';
        const qty = parseInt(item.Qty_PR_CM) || 0;
        
        const uniqueKey = `${itemNum}||${qty}||${poNumber}`;

        // Hanya ambil yang pertama kali muncul dengan unique key ini
        if (!uniqueItemsMap.has(uniqueKey)) {
            uniqueItemsMap.set(uniqueKey, {
                pr_gp_header_id: headerId,
                item_number: itemNum,
                item_desc: item.ITEMDESC?.trim() || "",
                uom: item.UOM?.trim() || "",
                qty_pr: qty,
                po_number: poNumber || null,
                site: item.Site?.trim() || null,
            });
        }
    });

    const itemsPayload = Array.from(uniqueItemsMap.values());

    console.log(`📊 Hasil dedup:`);
    console.log(`   - Total dari API: ${gpItems.length} rows`);
    console.log(`   - Setelah dedup: ${itemsPayload.length} unique items`);
    
    if (gpItems.length !== itemsPayload.length) {
        console.log(`   - Duplikat exact dihapus: ${gpItems.length - itemsPayload.length} rows`);
    }

    // =========================
    // 3️⃣ INSERT ITEMS
    // =========================
    const { data: insertedItems, error: itemError } = await supabase
        .from("pr_gp_items")
        .insert(itemsPayload)
        .select();

    if (itemError) {
        console.error("❌ Error insert items:", itemError);
        throw itemError;
    }

    console.log(`✅ Berhasil insert ${insertedItems.length} items`);

    // =========================
    // 4️⃣ RETURN CHECKLIST
    // =========================
    const { data: checklist, error } = await supabase
        .from("pr_gp_items")
        .select("*")
        .eq("pr_gp_header_id", headerId)
        .order("item_desc");

    if (error) throw error;

    return checklist;
};