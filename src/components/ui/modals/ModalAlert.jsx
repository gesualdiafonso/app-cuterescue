// Este modal es responsable por llevar las mensajes de alertas
// Para cuando usuario active BTN Emergency, Travel, Send Ubication
// Somente as mensagens primarias, em caso de BTN Emergency -> envia a tracker, 
// e se caso usuario tentar navegar por outras paginas, ele envia um novo modal 
// de alerta dizendo que não pode ir a outras paginas, que ativou modo alerta, voltando a tracker
// em caso de Travel, abre o modal de travel config
// em caso de Send Ubication -> informa usuario que vai chegar no seu email a localizacao do mascote

import React from "react";
import { 
    View, Modal, 
    Text, TouchableOpacity, 
    StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";

export default function ModalAlert({ visible, onClose, title, message, advertense, btnText }){
    const router = useRouter();

    return(
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title || "¡Atención!"}</Text>
                    <Text style={styles.text}>{message}</Text>
                    <Text style={styles.text}>{advertense}</Text>
                    <TouchableOpacity 
                        style={styles.btn} 
                        onPress={() => {
                            onClose();
                            router.push("/track");
                        }}
                    >
                        <Text style={styles.btnText}>{btnText || "Entendido"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    content: { 
        width: '80%', 
        backgroundColor: 'white', 
        padding: 25, 
        borderRadius: 20, 
        alignItems: 'center',
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#e74c3c', 
        marginBottom: 10
     },
    text: { 
        textAlign: 'center', 
        marginBottom: 20, 
        fontSize: 16 
    },
    btn: { 
        backgroundColor: '#e74c3c', 
        padding: 15, 
        borderRadius: 10, 
        width: '100%' 
    },
    btnText: { 
        color: 'white', 
        fontWeight: 'bold', 
        textAlign: 'center' 
    }
});