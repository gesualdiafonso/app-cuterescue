import React, { useState, useEffect } from "react"
import { 
    View, Modal, Text, Image, 
    TouchableOpacity, StyleSheet, 
    TextInput, Alert, ScrollView, 
    ActivityIndicator, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard
} from "react-native"
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import usePetManager from "../../../hooks/usePetManager";

export default function EditInfoPet({ visible, onClose, pet, onSuccess }){

    const { updatePet } = usePetManager();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState(null);
    const [form, setForm] = useState({
        nombre: "", especie: "", raza: "", peso: "",
        sexo: "", color: "", estado_salud: "", fecha_nacimiento: ""
    });

    // Datos para el dropdow
    const especieData = [
        { label: 'Canino', value: 'Canino' },
        { label: 'Felino', value: 'Felino' }
    ];

    const sexoData = [
        { label: 'Macho', value: 'Macho' },
        { label: 'Hembra', value: 'Hembra' }
    ];

    useEffect(() => {
        if(pet){
            setForm({
                nombre: pet.nombre || "",
                especie: pet.especie || "",
                raza: pet.raza || "",
                peso: pet.peso?.toString() || "",
                color: pet.color || "",
                estado_salud: pet.estado_salud || "",
                fecha_nacimiento: pet.fecha_nacimiento || "",
            });

            setImage({ uri: pet.foto_url });
        }
    }, [pet, visible]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7
        });

        if (!result.canceled) setImage(result.assets[0]);
    }

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
            const fileToUpload = (image && image.uri !== pet.foto_url) ? {
                uri: image.uri,
                name: `update_${pet.id}.jpg`,
                type: 'image/jpeg'
            } : null;

            const success = await updatePet(pet.id, form, fileToUpload );
            if (success) {
                if (onSuccess) await onSuccess();
                Alert.alert("Éxito", "Información actualizado");
                onClose();
            }
        } catch (error) {
            console.log("Error ao editar las información: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ width: '100%' }}
                    >
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Editar Información</Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                >
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <TouchableOpacity 
                                    style={styles.imageBox}
                                    onPress={pickImage}
                                >
                                    <Image source={{ uri: image?.uri }} style={styles.images} />
                                    <Text style={styles.imageLabel}>Cambiar Fotos</Text>
                                </TouchableOpacity>

                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.nombre}
                                    valueField={form.nombre}
                                    labelField={form.nombre}
                                    onChangeText={v => setForm({...form, nombre: v})}
                                />

                                <Text style={styles.label}>Especie *</Text>
                                <Dropdown 
                                    style={styles.dropdown}
                                    data={especieData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={form.especie}
                                    value={form.especie}
                                    onChange={item => setForm({...form, especie: item.especie})}
                                />

                                <Text style={styles.label}>Raza *</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.raza}
                                    valueField={form.raza}
                                    labelField={form.raza}
                                    onChangeText={v => setForm({...form, raza: v})}
                                />

                                <Text style={styles.label}>Sexo *</Text>
                                <Dropdown 
                                    style={styles.dropdown}
                                    data={sexoData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={form.sexo}
                                    value={form.sexo}
                                    onChange={item => setForm({...form, sexo: item.sexo})}
                                />

                                <Text style={styles.label}>Color *</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.color}
                                    valueField={form.color}
                                    labelField={form.color}
                                    onChangeText={v => setForm({...form, color: v})}
                                />

                                <Text style={styles.label} t>Peso (kg)</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.peso}
                                    valueField={form.peso}
                                    labelField={form.peso}
                                    onChangeText={v => setForm({...form, peso: v})}
                                />

                                <Text style={styles.label}>Estado de salud *</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.estado_salud}
                                    valueField={form.estado_salud}
                                    labelField={form.estado_salud}
                                    onChangeText={v => setForm({...form, estado_salud: v})}
                                />

                                <TouchableOpacity
                                    style={[styles.saveButton, isSubmitting && styles.disableButton]}
                                    onPress={handleUpdate}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Guardar Mascota</Text>
                                    )}
                                </TouchableOpacity>
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
        padding: 20 
    },
    content: { 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        padding: 20, 
        maxHeight: '80%' 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 15 
    },
    title: { 
        fontSize: 18, 
        fontWeight: 600, 
        color: '#22687b' 
    },
    label: { 
        marginTop: 10, 
        fontWeight: 600 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        marginTop: 5 
    },
    imageBox: { 
        alignItems: 'center', 
        marginBottom: 15 
    },
    img: { 
        width: 100, height: 100, 
        borderRadius: 50 
    },
    imageLabel: { 
        color: '#22687b', 
        marginTop: 5 
    },
    saveButton: { 
        backgroundColor: '#22687b', 
        padding: 15, 
        borderRadius: 10, 
        marginTop: 20, 
        alignItems: 'center' 
    },
    saveButtonText: { 
        color: '#fff', 
        fontWeight: 600 
    },
    dropdown: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
})