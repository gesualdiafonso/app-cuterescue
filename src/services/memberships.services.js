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

export const membershipService = {
    async getPlanDetails(planCode) {
        const { data, error } = await supabase
            .from("membresias")
            .select("max_mascotas, rastreo_km, slots_documentacion, titulo")
            .eq("codigo", planCode.toLowerCase())
            .single();
            
        if (error) {
            console.error("Error al buscar limites de las membresias")
            return null
        }

        return data;
    }
}