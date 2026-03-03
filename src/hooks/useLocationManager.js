// Este hook esta responsable por buscar la ubicación inicial y abrir un chanel de escucha para el pet seleccionado

import { useState, useEffect } from "react";
import { supabase } from "../services/Supabase";
import { locationService } from "../services/location.services";
import { emailService } from "../services/email.services";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-native";

export default function useLocationManager(selectedPet){
    const [petLocation, setPetLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const { user } = useAuth();

    const selectedPetId = selectedPet?.id;

    useEffect(() => {
        if (!selectedPetId) return;

        // 1. busca incial
        const fetchInitialLocation = async () => {
            try {
                const locations = await locationService.getPetsLocations([selectedPetId]);
                if (locations?.length > 0){
                    setPetLocation(locations[0]);
                }
            } catch (error) {
                console.log("Error al iniciar el fetch", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInitialLocation()

        // 2. configuramos el chanel realtime
        const chanel = supabase
            .channel(`location_pet_${selectedPetId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'localizacion',
                    filter: `mascota_id=eq.${selectedPetId}`,
                },
                (payload) => {
                    console.log("Movimiento detectado en Realtime: ", payload.new);
                    setPetLocation(payload.new);
                }
            )
            .subscribe();
        
        // Cleanup al desactivar o cambiar de pet
        return () => {
            supabase.removeChannel(chanel);
        };
    }, [selectedPetId]);

    const sendLocationEmail = async () => {
        if (!petLocation || !user || !selectedPet) {
            Alert.alert("Error", "Informações insuficientes para enviar o e-mail.");
            return false;
        }

        setIsSending(true);
        try {
            const safeAddress = [
                petLocation.direccion,
                petLocation.provincia
            ].filter(Boolean).join(", ") || "Dirección no disponible";

            await emailService.sendLocationEmail({
                userEmail: user.email,
                petName: selectedPet.nombre,
                address: safeAddress,
                lat: petLocation.lat,
                lng: petLocation.lng,
            });

            return true;
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar el correo.");
            return false;
        } finally {
            setIsSending(false);
        }
    };

    return { petLocation, setPetLocation, loading, sendLocationEmail, isSending }
}