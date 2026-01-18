// Responsable por la comunicación con la base de datos para la geocode

import { supabase } from "./Supabase";

export const locationService = {
    async getUserLocation(userId){
        const { data, error } = await supabase
            .from("localizacion_usuario")
            .select("*")
            .eq("owner_id", userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignora el error de no encontrado

        return data;
    },

    // Buscar localizaciones de múltiples pets de una ves
    async getPetsLocations(petIds){
        if (!petIds || petIds.length === 0) return [];

        const { data, error } = await supabase
            .from("localizacion")
            .select("*")
            .in("mascota_id", petIds);

        if (error) throw error;

        return data;
    },

    async createInitialPetLocation(petId, userId, baseLocation){
        const { error } = await supabase.from("localizacion").insert([{
            owner_id: userId,
            mascota_id: petId,
            chip: "1111",
            direccion: baseLocation.direccion,
            codigoPostal: baseLocation.codigoPostal,
            provincia: baseLocation.provincia,
            lat: baseLocation.lat,
            lng: baseLocation.lng,
            source: baseLocation.source,
            localizacion_segura: true,
            created_at: new Date(),
        }]);

        if (error) throw error;

        return true;
    },


}