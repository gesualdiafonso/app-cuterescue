/**
 * Este modal é encarregado de mostrar a mensagem informativa de aviso
 * e ativar o formulario para que o usuario possa colocar as informações solicitadas.
 */
import React from "react";
import { View, Modal, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";

export default function ModalTravel({ step, form, pets, setForm, handleFinish, handleNext }){
    
    return(
        <Modal visible={step > 0} animationType="slide">
            <View style={styles.container}>
                {step === 1 ? (
                    <View style={styles.formBox}>
                        <Text style={styles.title}>Modo Viaje</Text>
                        <Text style={styles.infoText}>Al activar este modo, configuraremos un perímetro de seguridad especial para tu mascota durante tu ausencia.</Text>
                        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                            <Text style={styles.btnText}>Configurar Seguridad</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.formBox}>
                        <Text style={styles.title}>Configuración</Text>
                        <TextInput placeholder="Nombre del Responsable" style={styles.input} onChangeText={t => setForm({...form, responsableName: t})}/>
                        <TextInput placeholder="Fecha Salida (DD/MM)" style={styles.input} onChangeText={t => setForm({...form, dateTravel: t})}/>
                        <TextInput placeholder="Fecha Regreso (DD/MM)" style={styles.input} onChangeText={t => setForm({...form, dateReturn: t})}/>
                        <TextInput placeholder="Distancia Límite (KM)" keyboardType="numeric" style={styles.input} onChangeText={t => setForm({...form, distance: t})}/>
                        
                        <Text style={styles.subtitle}>Mascotas Protegidas:</Text>
                        {pets && pets.length > 0 ? (
                            pets.map(pet => (
                                <Text key={pet.id} style={styles.petItem}>• {pet.nombre} (ID: {pet.id})</Text>
                            ))
                        ) : (
                            <Text style={styles.petItem}>Nenhuma mascota encontrada.</Text>
                        )}

                        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
                            <Text style={styles.btnText}>Finalizar y Volver</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    btn: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: 'white', fontWeight: 'bold' },
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    formBox: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15 },
    primaryBtn: { backgroundColor: '#22687b', padding: 15, borderRadius: 10, marginTop: 10 },
    petItem: { fontSize: 14, color: '#666', marginBottom: 5 }
});