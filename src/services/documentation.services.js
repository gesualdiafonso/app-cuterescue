// Documentación de las mascotas
import { supabase } from "./Supabase"
import * as Notifications from 'expo-notifications';

export const documentationService = {
    async getByPetId(userId, petId){
        const { data, error } = await supabase
            .from("documentacion")
            .select("*")
            .eq("user_id", userId)
            .eq("mascota_id", petId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data;
    },

    async createOrUpdated(register, id = null){
        if (id){
            const { data, error } = await supabase
                .from("documentacion")
                .update(register)
                .eq("id", id);

            if (error) throw error;

            return data;
        } else {
            const { data, error } = await supabase
                .from("documentacion")
                .insert([register]);

            if (error) throw error;
            
            return data;
        }
    },

    async delete(id){
        const { error } = await supabase.from("documentacion").delete().eq("id", id);
        if (error) throw error;
    },

    // centralizada para la lógica de notificaciones en el servicio o en un helper
    async checkAndCreateNotifications(items, mascota, userId){
        // Recorremos los documentos para verificar fechas de vencimiento
        if (!items || items.length === 0) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const item of items) {
            if (!item.fecha_vencimiento) continue;

            const expiryDate = new Date(item.fecha_vencimiento);
            expiryDate.setHours(0, 0, 0, 0);

            // calculamos los dias para el vencimiento
            const diffTime = expiryDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Se faltam 7, 1 o 0 días, agendamos una notificación local
            if ([7, 1, 0].includes(diffDays)) {
                const title = item.tipo_vacuna || item.producto || item.antiparasitario;

                let mensaje = "";
                if (diffDays === 0) mensaje = `¡Hoy es el día de vencimiento de ${title} de su mascota: ${mascota.nombre}`;
                else mensaje = `Faltan ${diffDays} día(s) para el vencimiento de ${title} de su mascota: ${mascota.nombre}`;

                // Agendar notificación local inmediatamente
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Recordatorio de vencimiento de Vacunas",
                        body: mensaje,
                        data: { docId: item?.id },
                    },
                    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
                        seconds: 1 
                    }, // null envia imediatamente al detectar el critério
                });

                // Opcional: Salvar en el banco de datos del Supabase para histórico
                await supabase.from("alertas").insert([{
                    user_id: userId,
                    mascota_id: mascota.id,
                    documentacion_id: item.id,
                    tipo: "Documentación de las Mascotas",
                    nivel: "info",
                    leido: false,
                    descripcion: mensaje,
                    created_at: new Date().toISOString(),
                }]);
            }
        }
    }
}