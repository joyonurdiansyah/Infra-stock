import { supabase } from "./supabaseClient";

export const fetchExistingRemarks = async () => {
    const { data, error } = await supabase
        .from("master_pr")
        .select("remarks");

    if (error) throw error;

    return new Set((data || []).map((d) => d.remarks).filter(Boolean));
};

export const insertMasterPR = async (payload) => {
    const { error } = await supabase
        .from("master_pr")
        .insert(payload);

    if (error) throw error;
};
