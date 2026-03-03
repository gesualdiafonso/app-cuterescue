// COntexto que va gerenciar los estados globales de:
// Pet Seleccionado, Datos de Cargamento.
// En expo se usa AsyncStorage
import React, { createContext, useContext, useState, useEffect } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from "expo-sqlite/kv-store";

import * as Location from 'expo-location';

const SavedDataContext = createContext();

export const SavedDataProvider = ({ children }) => {
    const [ selectedPet, setSelectedPetState ] = useState(null);
    const [ userLocation, setUserLocation ] = useState(null);

    // Cargamos los pets salvos al iniciar en la app

    useEffect(() => {
        let subscription;

        const initialize = async () => {
            // 1. Carregar Pet Salvo
            const storedPet = await AsyncStorage.getItem("@selectedPet");
            if (storedPet) setSelectedPetState(JSON.parse(storedPet));

            // 2. Pedir permissão e vigiar localização
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10,
                },
                (location) => {
                    setUserLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    });
                }
            );
        };

        initialize();

        return () => {
            if (subscription) subscription.remove();
        };
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