import { Alert } from "react-native";
import { supabase } from "./Supabase";

export const authService = {
    async login(email, password){
        const { data, error } = await supabase.auth.signInWithPassword({
            email, 
            password
        })
        if (error) throw error;
        return data;
    },

    async signUp(email, password, userData){
        let authUserId = null;
        // 1. Auth SingUp
        try{
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError) throw authError;

            // Verificação de segurança: Se o Supabase retornar sucesso mas sem user id 
            // (pode acontecer se o email precisar de confirmação e já existir)
            if (!authData?.user?.id) {
                throw new Error("El usuario ya existe o hubo un problema con el registro.");
            }

            const userId = authData.user.id;

            const { direccion, provincia, codigoPostal } = userData

            // 2. Insert perfil en la tabal de usuarios
            const { error: profileError } = await supabase
                .from('usuarios')
                .insert([
                    {
                        id: userId,
                        email: email,
                        ...userData
                    }
                ]);
            
            if (profileError) {
                console.log("Erro ao criar perfil:", profileError);
                throw profileError;
            };

            // 4. Geocoding, convertemos la ubicación en Lat/Lng
            let lat = 0;
            let lng = 0;
            try {
                const query = `${direccion}, ${provincia}, Argentina`;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
                );
                const geoData = await response.json();

                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lng = parseFloat(geoData[0].lon);
                }
            } catch (geoErr) {
                console.error("Erro no Geocoding:", geoErr);
                // Mesmo que o geocoding falhe, continuamos para não travar o registro
            }

            // 5. Inserimos en la tabla de 'localización'
            const { error: locationError } = await supabase
                .from('localizacion_usuario')
                .insert([
                    {
                        owner_id: userId,
                        direccion: direccion,
                        provincia: provincia,
                        codigoPostal: codigoPostal,
                        lat: lat,
                        lng: lng,
                        source: "OMS_geocode",
                        direccion_segura: true,
                        created_at: new Date()
                    }
                ]);
            
            if (locationError) {
                console.error("Erro ao salvar localização:", locationError);
                throw locationError;
            }

            return authData;
        } catch (error) {
            console.error("Error durante el registro:", error.message);
            Alert.alert("Error de registros", "Algo salió mal, ¡intentalo mas tarde!");
            throw error;
        }
    },

    async logout(){
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser(){
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },
}