import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/user.services";
import { membershipService } from "../services/memberships.services";
import usePetManager from "./usePetManager";

export default function usePlanLimits(){
    const { user } = useAuth();
    const { pets } = usePetManager();
    const [limits, setLimits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    // Callback
    const loadAllData = useCallback(async () => {
        if (!user?.id) return;

        try{
            setLoading(true);

            // 1. Buscamos el perfil completo del banco
            const profileData = await userService.fetchProfile(user.id);
            setProfile(profileData);

                // 2. Se houver um código de membresia, buscamos as regras/limites            
                if (profileData?.membresia_codigo){
                    const planDetails = await membershipService.getPlanDetails(profileData.membresia_codigo);
                    setLimits(planDetails);
                }
        } catch (error) {
            console.error("Erro al cargar limites y perfil: ", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // const loadLimits = async () => {
    //     const data = await membershipService.getPlanDetails(user.membresias_codigo);
    //     setLimits(data);
    //     setLoading(false)
    // }

    // Logica de block
    const canAddPet = limits ? pets.length < limits.max_mascotas : false;

    // Logica para documnentos.
    const canAddDocument = (currentDocCount) => {
        return limits ? currentDocCount < limits.slots_documentacion : false;
    };

    const planNameFormatted = profile?.membresia_codigo
        ? profile.membresia_codigo.charAt(0).toUpperCase() + profile.membresia_codigo.slice(1).toLowerCase()
        : "N/A";

    return {
        fullProfile: profile,
        limits,
        canAddPet,
        canAddDocument,
        planNameFormatted,
        loading,
        refreshLimits: loadAllData
    }
}