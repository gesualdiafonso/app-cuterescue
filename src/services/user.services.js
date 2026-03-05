/**
 * Servicio encargado de traer información de la tabla de usuarios de supabase
 * Para el uso de CRUD --> Read, Update, Create y Delete de los usuarios
 * Encargado de buscar el id usuario logado + información de mascotas por id de usuarios
 */
import { supabase } from "./Supabase";


export const userService = {

    /**
     * Para buscar el usuario según el Id que viene ya de la autenticación del Auth
     * @returns 
     */
    async fetchProfile(userId){
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", userId)
            .single();
        
        if (error) {
            console.log("Erro al cargar perfil de usuarios:", error)
        }

        return data;
    },

    /**
     * LLamada a Supabase para la edición de un perfil de usuario de la base de datos de usuarios
     * Podrá editar la fotos subidas -> storages
     * Podrá editar la Ubicación inicial (de la tabla localizacion_usuario)
     */
    async editProfile(userId, formData, file = null) {
        let foto_url = formData.foto_url

        // lógica de upload de imagenes para mobile
        if (file) {
            const fileExt = file.uri.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            const response = await fetch(file.uri);
            const blob = await response.blob();

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, blob, {
                    contentType: file.type || 'image/jpeg',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            // SALVE APENAS A URL LIMPA (Sem o ?t=...)
            foto_url = data.publicUrl; 
        }
        const updateData = {...formData};
        if (foto_url) updateData.foto_url = foto_url

        // 1. Actualiza la tabal usuarios
        const { error: userError } = await supabase
            .from("usuarios")
            .update(
                updateData
            )
            .eq("id", userId);

        if (userError) throw userError;

        // 2. actualize la tabal de localización
        const { error: locationError } = await supabase
            .from("localizacion_usuario")
            .update({
                direccion: formData.direccion,
                codigoPostal: formData.codigoPostal,
                provincia: formData.provincia,
                update_at: new Date(),
            })
            .eq("owner_id", userId);

        if (locationError) throw locationError;

        return { success: true }

 
    },
}