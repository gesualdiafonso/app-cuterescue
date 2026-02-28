import { supabase } from "./Supabase";

export async function getMemberships() {
    const { data, error } = await supabase
        .from("membresias")
        .select("codigo, titulo, precio_label, destacado, tema, beneficios")
        .eq("activa", true)
        .order("precio_mensual", { ascending: true });

    if (error) throw error;

    return data ?? [];
}