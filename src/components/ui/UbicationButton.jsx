import React from "react"
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native"

export default function UbicationButton({ onPress, loading }){
    return(
        <View style={{ flex: 0.48 }}>
            <TouchableOpacity 
                style={[styles.btnSend, styles.btn, loading && { opacity: 0.7 }]}
                onPress={onPress}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.btnText}>Enviar Ubiación</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        flex: 0.48,
        width: "100%",
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        margin: 5
    },
    btnSend: { 
        backgroundColor: '#1a5262' 
    },
    btnText: { 
        textAlign: "center",
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold' 
    },
})