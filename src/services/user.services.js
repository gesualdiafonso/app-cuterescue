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
        let foto_url = FormData.foto_url

        // lógica de upload de imagenes para mobile
        if (file) {
            const fileName = `${userId}-${Date.now()}.${file.uri.split('.').pop()}`;

            // En react Native, necesita converter la URI para un blob o usar base64
            const formDataImage = new FormData();
            formDataImage.append('file', {
                uri: file.uri,
                name: fileName,
                type: file.type || 'image/jpeg',
            });

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, formDataImage);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
            foto_url = data.publicUrl;
        }

        // 1. Actualiza la tabal usuarios
        const { error: userError } = await supabase
            .from("usuarios")
            .update({
                ...formData,
                foto_url
            })
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