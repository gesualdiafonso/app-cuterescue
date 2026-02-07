// Pagina de rastreo
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import Maps from "../../src/components/Maps"
import { useSavedData } from "../../src/contexts/SaveDataContext"
import { locationService } from "../../src/services/location.services"
import { Ionicons } from "@expo/vector-icons"
import { useThemeStatus } from "../../src/contexts/ThemeContext";
import EmergencyButton from "../../src/components/ui/EmergencyButton";
import UbicationButton from "../../src/components/ui/UbicationButton";
import useLocationManager from "../../src/hooks/useLocationManager";
import ModalMailCapture from "../../src/components/ui/modals/ModalMailCapture"

export default function Tracker(){
    const { selectedPet } = useSavedData();

    const { activateEmergency, status, resetStatus, themeColors } = useThemeStatus()

    const { petLocation, setPetLocation, sendLocationEmail, isSending } = useLocationManager(selectedPet?.id);

    const [showMailModal, setShowMailModal] = useState(false);

    const handleMailAction = async () => {
        const success = await sendLocationEmail();
        if (success) {
            setShowMailModal(true);
        }
    }

    useEffect(() => {
        if (selectedPet) {
            fetchPetLocation();
        }
    }, [selectedPet]);

    const fetchPetLocation = async () => {
        try {
            const locations = await locationService.getPetsLocations([selectedPet.id]);
            if (locations && locations.length > 0){
                setPetLocation(locations[0]);
            }
        } catch (error) {
            console.error("Error fetching pet location:", error);
        }
    };

    return(
        <View style={styles.container}>
            <Maps 
                location={petLocation}
                petPhoto={selectedPet?.foto_url}
            />
            {/* Overlay de información */}
            <SafeAreaView style={styles.overlayContainer}>
                <View style={styles.infoCard}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.petName}>{selectedPet?.nombre || "Seleccione una mascota!"}</Text>
                            <Text style={styles.locationText}>
                            <Text style={{ fontWeight: 'bold' }}>Ubicación: </Text>
                                {petLocation 
                                    ? `${petLocation.direccion}, ${petLocation.provincia}` 
                                    : "Buscando ubicación..."}
                            </Text>
                        </View>
                        <Image src={{ uri: selectedPet?.foto_url }} style={styles.miniAvatar} />
                    </View>

                    <View style={styles.buttonRow}>
                        {/* <TouchableOpacity style={[styles.btnEmergency, styles.btn, status === 'emergency' && {backgroundColor: "#2ecc71"}]}>
                            <Text style={styles.btnText}>Emergencia</Text>
                        </TouchableOpacity> */}
                        <EmergencyButton style={[styles.btnEmergency, styles.btn, status === 'emergency' && {backgroundColor: "#2ecc71"}]}  />

                        <UbicationButton onPress={handleMailAction} loading={isSending} />
                        <ModalMailCapture visible={showMailModal} onClose={() => setShowMailModal(false)}/>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    infoCard: {
        backgroundColor: 'rgba(34, 104, 123, 0.85)', // Tom esverdeado transparente da imagem
        borderRadius: 20,
        padding: 20,
        marginTop: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    petName: { 
        color: 'white', 
        fontSize: 22, 
        fontWeight: 'bold' 
    },
    locationText: { 
        color: 'white', 
        fontSize: 13, 
        marginTop: 4, 
        width: '80%' 
    },
    miniAvatar: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        borderWhite: 2, 
        borderColor: 'white' 
    },
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
});