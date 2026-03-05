// Hook que va orchestrar todo el contexto, va remover la lógica del supabase adentro de los componentes

import { useState, useCallback, useEffect } from "react";
import { petService } from "../services/pet.services";
import { locationService  } from "../services/location.services";
import { useSavedData } from "../contexts/SaveDataContext";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-native";

export default function usePetManager(){
    const { user } = useAuth();
    const { selectedPet, setSelectedPet, setUserLocation } = useSavedData();

    const [ pets, setPets ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    // 1. Read, vamos a buscar los pets y sus ubicaciones
    const fetchAllData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try{
            // Buscamos la ubicación de usuario
            const uLoc = await locationService.getUserLocation(user.id);
            setUserLocation(uLoc);

            // buscamos los pets
            const petsData = await petService.getAllPets(user.id);

            // buscamos la ubicación de los pets
            const petIds = petsData.map(p => p.id);
            const locsData = await locationService.getPetsLocations(petIds);

            // Mesclamos pet con la ubicación
            const mergedPets = petsData.map(pet => ({
                ...pet,
                localizacion: locsData.find(l => l.mascota_id === pet.id) || null,
            }));

            setPets(mergedPets);

            // Sincronizamos pet seleccionado, (si no hay seleccionado lo limpia)
            if (selectedPet) {
                const stillExists = mergedPets.find(p => p.id === selectedPet.id);
                if (!stillExists) setSelectedPet(null);
                else setSelectedPet(stillExists); // Actualiza los datos nuevos

            } else if (mergedPets.length > 0){
                setSelectedPet(mergedPets[0]); // seleciona el primero por default
            }
        } catch (error) {
            console.error("Error al cargar los datos:", error)
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchAllData();
        }
    }, [user, fetchAllData])

    // 2. Create
    const addPet = async (form, file) => {
        try{
            const response = await petService.createPet(form, user.id, file);

            // console.log("Pet criado", newPet);
            
            const petData = Array.isArray(response) ? response[0] : response;

            if (!petData || !petData?.id){
                throw new Error("Nao foi possivel obter el ID de pet criado");
            }

            // Si hay localización del usuario, vaos a crear la inicial para el pet
            const uLoc = await locationService.getUserLocation(user.id);
            if (uLoc && petData?.id) {
                await locationService.createInitialPetLocation(response.id, user.id, uLoc);
                console.log("Localización incial (Dueño) vinculado al pet.")
            }

            await fetchAllData();

            return petData;
        } catch (error) {
            Alert.alert("Error al agregar pet: " + error.message);
            console.error(error);
        }
    }

    // 3. Updated
    const updatePet = async (petId, data, file) => {
        try {
            const updated = await petService.editPet(petId, data, user.id, file);
            await fetchAllData();
            return updated;
        } catch (error) {
            Alert.alert("Error al editar pet: " + error.message);
            console.error(error);
        }
    }

    // 4. Delete
    const deletePet = async (petId) => {
        try {
            await petService.deletePet(petId);
            if (selectedPet?.id === petId) setSelectedPet(null);
            await fetchAllData();
            return true;
        } catch (error) {
            Alert.alert("Error al deletar pet: " + error.message);
            console.error(error);
        }
    }

    return {
        pets,
        loading,
        selectedPet,
        setSelectedPet,
        addPet,
        updatePet,
        deletePet,
        refreshPets: fetchAllData
    };
}