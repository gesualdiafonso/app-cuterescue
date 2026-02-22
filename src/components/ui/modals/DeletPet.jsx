import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import usePetManager from "../../../hooks/usePetManager"

export default function DeletPet({ visible, onClose, pet }){
    const { deletePet } = usePetManager();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deletePet(pet.id);

            // 1. cierra el modal
            onClose();
            // 2. El hook usePetManage automaticamente llama el fetchAllData
            // Salimos con un Alert de aviso
            setTimeout(() => {
                Alert.alert("Eliminado", `${pet.nombre} ha sido borrado.`);
            }, 500)

        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el pet.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>¿Borrar Mascota?</Text>
                    <Text style={styles.desc}>Esta acción no se puede deshacer. ¿Deseas eliminar a {pet?.nombre}?</Text>
                    
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Borrar</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    card: { 
        width: '80%', 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        padding: 25 
    },
    title: { 
        fontSize: 20, 
        fontWeight: 600, 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    desc: { 
        fontSize: 16, 
        color: '#666', 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    btnCancel: { 
        flex: 1, 
        padding: 12, 
        alignItems: 'center' 
    },
    btnDelete: { 
        flex: 1, 
        backgroundColor: '#d9534f', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    btnText: { 
        color: '#fff', 
        fontWeight: 600 
    }
})