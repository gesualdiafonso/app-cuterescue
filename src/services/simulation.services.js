import { getAddressFromCoordinates } from "./geoAPI.services";
import { supabase } from "./Supabase";

function generateRadomCoords(lat, lng, radiusKm) {
    const r = radiusKm / 111;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * r;
    const latOffset = distance * Math.cos(angle);
    const lngOffset = (distance * Math.sin(angle)) / Math.cos(lat * (Math.PI / 180));

    return {
        lat: lat + latOffset,
        lng: lng + lngOffset,
    };
}

async function updatePetLocation(petId, newLocation){
    const { lat, lng, direccion, codigoPostal, provincia } = newLocation;
    const { error } = await supabase
        .from("localizacion")
        .update({ 
            lat, 
            lng, 
            direccion, 
            codigoPostal, 
            provincia, 
            updated_at: new Date()
        })
        .eq("mascota_id", petId);

    if (error) throw new Error("Error actualizando ubiación: " + error.message);
}

export function startRealTimeSimulation(pet, userLocation, type = "normal", onUpdate){
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
        console.error("Simulación abortada: userLocation inválido", userLocation)
        return () => {};
    }
    
    const radiusMap = { normal: 0.05, paseo: 0.08, emergency: 0.2 };
    const radius = radiusMap[type] || 0.05;
    const interval = setInterval(async () => {
        try{
            const coords = generateRadomCoords(userLocation.lat, userLocation.lng, radius);
            const fullAddress = await getAddressFromCoordinates(coords.lat, coords.lng);
            
            // Parsing simples de string del OSM para NAtive
            const parts = fullAddress ? fullAddress.split(", ") : [];
            const simulated = {
                lat: coords.lat,
                lng: coords.lng,
                direccion: parts.slice(0, 2).join(", "),
                provincia: parts[parts.length - 3] || "",
                codigoPostal: parts.find(p => /\d{4,8}/.test(p)) || "",
            };

            await updatePetLocation(pet.id, simulated);
            if (onUpdate) onUpdate(simulated);
        } catch(error){
            console.error("Falla en simulación Native: ", error)
        }
    }, 5000); // Tiempo para la sobrecarga

    return () => clearInterval(interval);
}