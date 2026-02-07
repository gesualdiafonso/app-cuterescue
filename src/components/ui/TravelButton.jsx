/**
 * Este componente é responsavel de executar a ação de viagem dentro do aplicativo,
 * Abrir modal informativo de aviso
 * Seguinte modal de configuração com um formulario para configurar informações como:
 * - data de ida e data de volta
 * - responsavel pelo animal
 * - limite de distancia que o animal pode percorrer em km
 * - lista das mascotas asignada ao usuario.
 * Muda a UI do usuario quando ativado o botão, caso usuario volte antes tem botão oposto que é ja estou de volta
 * e retorna a configuração default do app
 */

import React, { useState } from "react";
import { View, Modal, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useThemeStatus } from "../../contexts/ThemeContext";
import { useSavedData } from "../../contexts/SaveDataContext";
import ModalTravel from "./modals/ModalTravel";

export default function TravelButton( { pets }){
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(false);
    const { activateTravel, status, resetStatus } = useThemeStatus();
    const { selectedPet } = useSavedData()
    const [form, setForm] = useState({ 
        limitedDistance: '', 
        responsableName: '', 
        dateTravel: '', 
        dateReturn: '',
        mascotas: []
    });

    const handleConfirm = () => {
        activateTravel(form);
        setVisible(false);
        setStep(0);

    };

    const handleNext = () => setStep(2)

    if (status === 'travel') {
        return (
            <TouchableOpacity style={[styles.btn, {backgroundColor: '#95a5a6'}]} onPress={resetStatus}>
                <Text style={styles.btnText}>Ya estoy de vuelta</Text>
            </TouchableOpacity>
        );
    }

    return(
        <View>
            <TouchableOpacity style={styles.btn} onPress={() => setVisible(true)}>
                <Text style={styles.text}>Estoy Viaje</Text>
            </TouchableOpacity>
            <ModalTravel 
                visible={step} 
                pets={pets} 
                setForm={setForm} 
                form={form} 
                handleNext={handleNext} 
                handleFinish={handleConfirm} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        backgroundColor: "#22687b",
        padding: 15,
        borderRadius: 15,
        margin: 5,
        alignContent: "center"
    }, 
    text: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff"
    }
})