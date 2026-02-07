// COntexto que va gerenciar los estados globales de:
// Pet Seleccionado, Datos de Cargamento.
// En expo se usa AsyncStorage
import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "expo-sqlite/kv-store";

const SavedDataContext = createContext();

export const SavedDataProvider = ({ children }) => {
    const [ selectedPet, setSelectedPetState ] = useState(null);
    const [ userLocation, setUserLocation ] = useState(null);

    // Cargamos los pets salvos al iniciar en la app

    useEffect(() => {
        const loadStoredData = async () => {
            const storedPet = await AsyncStorage.getItem("@selectedPet");
            if (storedPet) setSelectedPetState(JSON.parse(storedPet));
        };
        loadStoredData();
    }, []);

    // funcioón para cambiar el pet seleccionado globalmente
    const updatedSelectedPet = async (pet) => {
        setSelectedPetState(pet);
        if (pet) {
            await AsyncStorage.setItem("@selectedPet", JSON.stringify(pet));
        } else {
            await AsyncStorage.removeItem("@selectedPet");
        }
    };

    return (
        <SavedDataContext.Provider value={{
            selectedPet,
            setSelectedPet: updatedSelectedPet,
            userLocation,
            setUserLocation
        }}>
            {children}
        </SavedDataContext.Provider>
    )
}

export const useSavedData = () => useContext(SavedDataContext);