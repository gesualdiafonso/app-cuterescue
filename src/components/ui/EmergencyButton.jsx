/**
 * Botão de emergencia, para ação de restrição do usuario, 
 * ativa modal informativo dizendo que o app está em modo emergencia,
 * Muda a ui do usuario, nnao permite que ele navegue por outros lugar sómente para tracker e dashboard
 * usuario pode sair do modo de ação de emergencia quando clicar no seu oposto que é encontrei meu pet
 * uma vez ativado, a UI volta ao normal
 */

import React, { useState } from "react"
import { View, Modal, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeStatus } from "../../contexts/ThemeContext";
import { usePathname, useRouter } from "expo-router";
import ModalAlert from "./modals/ModalAlert";
import { useSavedData } from "../../contexts/SaveDataContext";

export default function EmergencyButton(){
    const [visible, setVisible] = useState(false);
    const { activateEmergency, resetStatus, status } = useThemeStatus();
    const router = useRouter();
    const pathname = usePathname();
    const { selectedPet, userLocation } = useSavedData();

    const isEmergency = status === "emergency";

    const handlePress = () => {
        if (isEmergency) {
            // si esta en emergencia, el btn va decir "encontré mi masc"
            resetStatus();
        } else {
            setVisible(true);
        }
    };

    // const handleAlert = () => {
    //     activateEmergency();
    //     setVisible(false);
    //     router.push("/track");
    // }

    const confirmEmergency = () => {
       if (selectedPet && userLocation) {
             activateEmergency(selectedPet, userLocation);
            setVisible(true);
            if (pathname !== "/track") {
                router.push("/track")
            }
       } else {
            Alert("Seleccione un pet y active su ubicación primero")
       }
    }


    return (
        <View>
            <TouchableOpacity style={[styles.btn, isEmergency ? styles.btnActive : styles.btnNormal]} onPress={handlePress}>
                <Text style={styles.text}>
                    {isEmergency ? "¡Encontré mi Mascota!" : "Emergencia"}
                </Text>
            </TouchableOpacity>

            {/* <ModalAlert visible={visible} onClose={handleAlert} /> */}

            {!isEmergency && (
                <ModalAlert
                    visible={visible}
                    onClose={confirmEmergency}
                    title="Modo Emergencia activado"
                    message="
                        Un alerta fue envíado al chip, la activación de la ubicación en tiempo real ha sido activada, esté atenta en su casilla de mail, active sus notificaciones para que esté ubicando su pet.
                    "
                    advertense="La actualización del movimiento de la mascota se completará en un tiempo estimado de 20 minutos"
                    btnText="Ir al Mapa"
                />
            )}

            {/* <Modal visible={visible} transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContet}>
                        <Text style={styles.title}>Has activado el botón de emergenci</Text>
                        <Text style={styles.paragraph}>Un alerta fue envíado al chip, la activación de la ubicación en tiempo real ha sido activada, esté atenta en su casilla de mail, active sus notificaciones para que esté ubicando su pet.</Text>
                        <Text style={styles.aviso}>La actualización del movimiento de la mascota se completará en un tiempo estimado de 20 minutos</Text>
                        <TouchableOpacity style={styles.btnAlert} onPress={handleAlert}>
                            <Text style={styles.btnText}>Seguir para Mapa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}
        </View>
    )
}

const styles = StyleSheet.create({
    btn:{
        width: "100%",
        backgroundColor: "#ff8c09",
        padding: 15,
        borderRadius: 15,
        margin: 5,
        alignContent: "center"
    },
    text:{
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {},
    modalContet: {},
    title: {},
    paragraph: {},
    aviso: {},
    btnAlert: {},
    btnText: {}
})