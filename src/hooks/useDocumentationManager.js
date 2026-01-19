// Hook encargado de hacer las comunicaciones de estados y filtrado de los pets
import { useState, useCallback, useEffect } from "react";
import { documentationService } from "../services/documentation.services";
import { useSavedData } from "../contexts/SaveDataContext"
import { useAuth } from "../contexts/AuthContext"

export default function useDocumentation() {
    const { user } = useAuth();
    const { selectedPet } = useSavedData();

    const [docs, setDocs] = useState({
        tipo_vacuna: [],
        presentacion: [],
        antiparasitarios: [],
        alerta: [],
    });

    const [ loading, setLoading ] = useState(false);

    const fetchDocs = useCallback(async () => {
        if (!user || !selectedPet) return;
        setLoading(true);
        try{
            const data = await documentationService.getByPetId(user.id, selectedPet.id);

            setDocs({
                vacunas: data.filter(d => d.tipo === "vacuna" || d.tipo === "tipo_vacuna"),
                presentacion: data.filter(d => d.tipo === "presentacion"),
                antiparasitarios: data.filter(d => d.tipo === "antiparasitarios")
            });

            // disparamos la notificaciones en background
            documentationService.checkAndCreateNotifications(data, selectedPet, user.id);

        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false);
        }
    }, [user, selectedPet])

    // Siempre que el pet selecionado se cambia el contexto global, recarga los datos
    useEffect(() => {
        fetchDocs();
    }, [selectedPet, fetchDocs]);

    useEffect(() => {
        if (selectedPet?.id) {
            // Chame sua função de busca aqui
            fetchDocs(selectedPet.id);
        }
    }, [selectedPet?.id]);

    const saveDoc = async (formData, editId = null) => {
        const registro = { ...formData, user_id: user.id, mascota_id: selectedPet.id }
        await documentationService.createOrUpdated(registro, editId);
        await fetchDocs();
    };

    const removeDoc = async (id) => {
        await documentationService.delete(id);
        await fetchDocs();
    }

    return {
        docs,
        loading,
        selectedPet,
        saveDoc,
        removeDoc,
        refresh: fetchDocs
    };
}