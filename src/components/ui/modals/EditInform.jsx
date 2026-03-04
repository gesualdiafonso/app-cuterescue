import React, { useState, useEffect } from "react";
import { 
    View, Modal, StyleSheet, 
    ActivityIndicator, Alert, Text, 
    TextInput, ScrollView, TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform, Keyboard
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { userService } from '../../../services/user.services'

export default function EditInform({ visible, onClose, profileData, onUpdateSuccess }){
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);

    // Sincronizar los datos iniciales cuando el modal abre
    useEffect(() => {
        if (profileData){
            setFormData({
                nombre: profileData.nombre,
                apellido: profileData.apellido,
                telefono: profileData.telefono,
                direccion: profileData.direccion,
                provincia: profileData.provincia,
                codigoPostal: profileData.codigoPostal,
                foto_url: profileData.foto_url
            });
        }
    }, [profileData, visible]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled){
            setImage(result.assets[0]);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await userService.editProfile(profileData.id, formData, image);
            Alert.alert("Éxito", "Perfil actualizado correctamente");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }
    
    return(
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <View style={styles.modalContainer}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.title}>Editar Perfil</Text>

                                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                                    <Text style={{color: 'blue'}}>📸 Cambiar Foto de Perfil</Text>
                                    {image && <Text style={{fontSize: 10}}>{image.uri.substring(0, 30)}...</Text>}
                                </TouchableOpacity>

                                <Text style={styles.label}>Nombre</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={formData.nombre} 
                                    onChangeText={(t) => setFormData({...formData, nombre: t})}
                                />

                                <Text style={styles.label}>Apellido</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={formData.apellido} 
                                    onChangeText={(t) => setFormData({...formData, apellido: t})}
                                />

                                <Text style={styles.label}>Teléfono</Text>
                                <TextInput 
                                    style={styles.input} 
                                    keyboardType="phone-pad"
                                    value={formData.telefono} 
                                    onChangeText={(t) => setFormData({...formData, telefono: t})}
                                />

                                <View style={styles.separator}><Text>Ubicación</Text></View>

                                <Text style={styles.label}>Dirección</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={formData.direccion} 
                                    onChangeText={(t) => setFormData({...formData, direccion: t})}
                                />

                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{width: '45%'}}>
                                        <Text style={styles.label}>Provincia</Text>
                                        <TextInput 
                                            style={styles.input} 
                                            value={formData.provincia} 
                                            onChangeText={(t) => setFormData({...formData, provincia: t})}
                                        />
                                </View>
                                <View style={{width: '45%'}}>
                                        <Text style={styles.label}>Cod. Postal</Text>
                                        <TextInput 
                                            style={styles.input} 
                                            value={formData.codigoPostal} 
                                            onChangeText={(t) => setFormData({...formData, codigoPostal: t})}
                                        />
                                </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
                                        <Text style={{color: '#fff'}}>Cancelar</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSave} disabled={loading}>
                                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff'}}>Guardar</Text>}
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    modalContainer: { 
        width: '90%', 
        maxHeight: '85%', 
        backgroundColor: '#fff', 
        borderRadius: 20, 
        padding: 20 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 600, 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    label: { 
        fontWeight: 600, 
        marginTop: 10, 
        marginBottom: 5 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 10 
    },
    separator: { 
        marginVertical: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        paddingBottom: 5 
    },
    imageBtn: { 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: '#f0f0f0', 
        borderRadius: 10, 
        marginBottom: 15 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 30 
    },
    btn: { 
        paddingVertical: 12, 
        paddingHorizontal: 30, 
        borderRadius: 10, 
        minWidth: 120, 
        alignItems: 'center' 
    },
    btnCancel: { 
        backgroundColor: '#ff4444' 
    },
    btnSave: { 
        backgroundColor: '#00C851' 
    }
})