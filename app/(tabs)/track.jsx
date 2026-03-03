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

    const { petLocation, sendLocationEmail, isSending } = useLocationManager(selectedPet);

    const { activateEmergency, status, resetStatus, themeColors } = useThemeStatus()

    const [showMailModal, setShowMailModal] = useState(false);

    const handleMailAction = async () => {
        const success = await sendLocationEmail();
        if (success) setShowMailModal(true);
    }

    return(
        <View style={styles.container}>
            
            {/* 🔥 O MAPA AGORA RECEBE location QUE VEM DO REALTIME */}
            <Maps 
                location={petLocation}
                petPhoto={selectedPet?.foto_url}
            />
            
            <View style={styles.overlayContainer}>
                <View style={styles.infoCard}>
                    <View style={styles.headerRow}> 
                        <View style={styles.textContainer}> 
                            <Text style={styles.petName}>{selectedPet?.nombre || "Ronnie"}</Text> 
                            <Text style={styles.locationText} numberOfLines={2}> 
                                <Text style={styles.locationLabel}>Ubicación: </Text> 
                                {petLocation 
                                    ? `${petLocation.direccion}, ${petLocation.provincia}` 
                                    : "Cargando dirección..."
                                } 
                            </Text> 
                        </View> 
                        {/* <Image source={{ uri: selectedPet?.foto_url }} style={styles.miniAvatar} /> */} 
                    </View>
                    <View style={styles.buttonRow}>
                        <EmergencyButton />
                        <UbicationButton 
                            onPress={handleMailAction} 
                            loading={isSending} 
                        />
                    </View>
                </View>
            </View>
            
            <ModalMailCapture 
                visible={showMailModal} 
                onClose={() => setShowMailModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0, // Começa do topo absoluto
        left: 0,
        right: 0,
        // paddingHorizontal: 10,
        // paddingTop: 50, // Espaço para a status bar (ajuste conforme necessário)
    },
    infoCard: {
        backgroundColor: 'rgba(34, 104, 123, 0.85)', // Cor exata do design com transparência
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20,
        padding: 20,
        // Sombra para destacar do mapa
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    petName: { 
        color: 'white', 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    locationLabel: {
        fontWeight: '700',
        color: '#f1c40f', // Cor amarelada/laranja para o label "Ubicación"
    },
    locationText: { 
        color: 'white', 
        fontSize: 14, 
        marginTop: 4,
        lineHeight: 18,
    },
    miniAvatar: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        borderWidth: 2, 
        borderColor: 'white' 
    },
    buttonRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        gap: 15, // Espaçamento entre os botões
    },
});