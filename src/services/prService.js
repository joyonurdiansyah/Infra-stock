import { supabase } from "./supabaseClient";

/**
 * CREATE MANUAL PR
 * - insert header
 * - insert detail items
 */
export async function createManualPR(form, items) {
  /* ================= HEADER ================= */
  const { data: header, error: headerError } = await supabase
    .from("pr_headers")
    .insert([
      {
        pr_number: form.pr_number,
        company: form.company,
        received_date: form.received_date || null,
        status: form.status,
      },
    ])
    .select()
    .single();

  if (headerError) {
    throw new Error(headerError.message);
  }

  /* ================= DETAILS ================= */
  const detailPayload = items.map((item, index) => ({
    pr_header_id: header.id,
    item_specification: item.item_specification,
    category: item.category,
    qty: item.qty,
    line_number: index + 1,
  }));

  const { error: detailError } = await supabase
    .from("pr_details")
    .insert(detailPayload);

  if (detailError) {
    throw new Error(detailError.message);
  }

  return header;
}
