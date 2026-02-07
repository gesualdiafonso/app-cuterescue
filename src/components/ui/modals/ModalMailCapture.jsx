import { 
    View, Modal, Text, 
    TouchableOpacity, 
    StyleSheet, Animated 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ModalMailCapture({ visible, onClose }){
    return(
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.iconCircle}>
                    <Ionicons name="mail-unread-outline" size={50} color="#1a5262" />
                </View>

                <Text style={styles.title}>¡Ubicación Enviada!</Text>

                <Text style={styles.message}>
                    Hemos enviado un correo electrónico con el elance de Google Maps y los detalles de su mascota
                </Text>

                <Text style={styles.subMessage}>
                    Revisa tu bandeja de entrada (y la carpeta de spam por si las dudas).
                </Text>

                <TouchableOpacity style={styles.button} onPress={onClose}>
                    <Text style={styles.buttonText}>Entendido</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 25,
        padding: 25,
        alignItems: "center",
        elevation: 10, // Sombra no Android
        shadowColor: "#000", // Sombra no iOS
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#e8f4f6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1a5262",
        marginBottom: 15,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 10,
    },
    subMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: 25,
    },
    button: {
        backgroundColor: "#1a5262",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});