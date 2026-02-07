/**
 * Contexto encarregado de modificar o tema da UI quando os botões estiverem em ação
 */

import React, { createContext, useContext, useState } from "react";
import { startRealTimeSimulation } from "../services/simulation.services";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [ status, setStatus ] = useState("normal"); // 'normal', 'trevel', 'emergency'

    const [travelConfig, setTravelConfig] = useState(null);

    const [stopSimFunc, setStopSimFunc] = useState(null);

    const activateTravel = (config) => {
        setTravelConfig(config);
        setStatus("travel");
    }

    const activateEmergency = (pet, userLocation) => {
        setStatus("emergency");

        // incializar la simulación 
        const stop = startRealTimeSimulation(pet, userLocation, "emergency", (newData) => {
            console.log("Pet moviéndose: ", newData.direccion);

        })

        setStopSimFunc(() => stop);
    
    }

    const resetStatus = () => {
        setStatus("normal");
        if (stopSimFunc) {
            stopSimFunc();
            setStopSimFunc(null);
        }

        if (travelConfig) {
            setTravelConfig(null);
        }
    }

    // Definición de los colores basado en el estado
    const themeColor = {
        primary: status === "emergency" ? '#e76c3' : (status === 'travel' ? '#3498db' : "#22687b"),
        background: status === 'emergency' ? '#fdecea' : '#ffffff'
    };

    // Helper para verificar si la rota es o no permitida en el modo emergencia
    const isRouteAllower = (path) => {
        if (status !== "emergency") return true;
        return path === "/(tabs)/track" || path === "/(tabs)/dashboard";
    }

    return(
        <ThemeContext.Provider value={{
            status,
            activateEmergency,
            activateTravel,
            resetStatus,
            themeColor,
            travelConfig,
            isRouteAllower
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeStatus = () => useContext(ThemeContext);