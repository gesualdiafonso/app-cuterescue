/**
 * Servicio encargado de traer información de la tabla de mascotas de supabase
 * Para el uso de CRUD --> Read, Update, Create y Delete de las mascotas
 * Encargado de buscar el id usuario logado + información de mascotas por id de usuarios
 */
import { supabase } from "./Supabase";

export const petService = {
    // Buscamos tods los pets de un usuario específico
    async getAllPets(userId){
        const { data, erro } = await supabase
            .from("mascotas")
            .select("*")
            .eq("owner_id", userId);

        if (erro) throw new Error("Error al cargar pet", erro);

        return data;
        
    },

    async createPet(petData, userId, file){
        let fotoUrl = null;

        if (file){
            fotoUrl = await this.uploadPetPhoto(userId, file);
        }

        const { data, erro } = await supabase
            .from("mascotas")
            .insert([
                {
                    ...petData,
                    owner_id: userId,
                    foto_url: fotoUrl,
                }
            ]).select().single();

        if (erro) throw erro;

        return data;
    },

    async editPet(petId, updateData, userId, file){
        let fotoUrl = updateData.foto_url;

        if (file){
            fotoUrl = await this.uploadPetPhoto(userId, file);
        }

        const { data, error } = await supabase
            .from("mascotas")
            .update({
                ...updateData,
                foto_url: fotoUrl,
                updated_at: new Date()
            }).select().single();

        if (error) throw error;

        return data;
    },

    async deletePet(petId){
        const { error } = await supabase.from("mascotas").delete().eq("id", petId);

        if (error) throw error;

        return true;
    },

    // Upload de fotos para el Bucket
    async uploadPetPhoto(userId, file){
        const fileName = `${userId}_${Date.now()}_${file.name || 'photo'}`;

        const { error: uploadError } = await supabase.storage.from("mascotas").upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("mascotas").getPublicUrl(fileName);

        return data.publicUrl;
    }
}