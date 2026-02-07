import { 
    Modal, View, Text, TextInput, 
    TouchableOpacity, ScrollView, 
    ActivityIndicator, Alert, Image, StyleSheet
} from "react-native";
import { CardAdd, CardBody } from "../../styles/general.styles";
import usePetManager from "../../hooks/usePetManager";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';


export default function AddCard(){
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ image, setImage] = useState(null);

    // llamamos el hook
    const { addPet } = usePetManager();

    // estado del formulario
    const [ form, setForm ] = useState({
        nombre: "",
        especie: "",
        raza: "",
        peso: "",
        sexo: "",
        color: "",
        estado_salud: "",
        fecha_nacimiento: "",
    });

    const handleOpen = () => setModalVisible(true);

    const handleClose = () => {
        if (!isSubmitting) setModalVisible(false);
    };

    // Función para selecionar una image
    const pickImage = async () => {
        let result = await ImagePicker.lunchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            aspect: [4, 3],
            qaulity: 0.7,
        });

        if (!result.canceled){
            setImage(result.assets[0]);
        }
    }

    const handleSave = async () => {
        // Validación simples
        if (!form.nombre || !form.especie){
            Alert.alert("Campos son obrigatorios", "Por favor, preenchelo el nombre y/o la espécie")
            return;
        }

        setIsSubmitting(true);
        try{
            // llamamos al hook (que ya esta lidando con el refresh y la ubicación)
            const fileToUpload = image ? {
                uri: image.uri,
                name: image.fileName || `pet_${Date.now()}.jpg`,
                type: image.mimeType || `image/jpeg`
            } : null;

            // addPet de refreshPets()
            const success = await addPet(form, fileToUpload);

            if (success) {
                Alert.alert("Sucesso", "Mascota agregada correctamente.");
                setForm();
                setImage(null);
                setModalVisible(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <ScrollView>
            <TouchableOpacity onPress={handleOpen}>
                <CardAdd>
                    <CardBody>
                        <Text>+</Text>
                        <Text>Agregar mas mascotas</Text>
                    </CardBody>
                </CardAdd>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}> Agregar Nueva Mascota</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeButton}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image src={{ uri: image.uri }} style={styles.previewImage} />
                                ) : (
                                    <Text styles={styles.imagePickerText}>Seleccionar Foto</Text>
                                )}
                            </TouchableOpacity>

                            <Text styles={styles.label}>Nombre *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.nombre} 
                                onChangeText={ (val) => setForm({ ...form, nombre: val }) } 
                            />

                            <Text>Especie *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.especie} 
                                onChangeText={ (val) => setForm({ ...form, especie: val }) }
                                placeholder="Canino / Felino" 
                            />

                            <Text styles={styles.label}>Raza *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.raza} 
                                onChangeText={ (val) => setForm({ ...form, raza: val }) } 
                            />

                            <Text styles={styles.label}>Fecha de nacimiento *</Text>
                            <TextInput 
                                style={styles.input} 
                                keyboardType="date"
                                value={form.fecha_nacimiento} 
                                onChangeText={ (val) => setForm({ ...form, fecha_nacimiento: val }) } 
                            />

                            <Text styles={styles.label}t>Peso (kg)*</Text>
                            <TextInput 
                                style={styles.input} 
                                keyboardType="numeric"
                                value={form.peso} 
                                onChangeText={ (val) => setForm({ ...form, peso: val }) } 
                            />

                            <Text styles={styles.label}>Color (kg)*</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.color} 
                                onChangeText={ (val) => setForm({ ...form, color: val }) } 
                            />

                            <Text styles={styles.label}>Sexo *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.sexo} 
                                onChangeText={ (val) => setForm({ ...form, sexo: val }) } 
                                placeholder="Macho / Hembra"
                            />

                            <Text styles={styles.label}>Estado de salud *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.estado_salud} 
                                onChangeText={ (val) => setForm({ ...form, estado_salud: val }) } 
                            />

                            <TouchableOpacity
                                style={[styles.saveButton, isSubmitting && styles.disabledButton]}
                                onPress={handleSave}
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
                </View>
            </Modal>
        </ScrollView>


    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#22687b'
    },
    closeButton: {
        fontSize: 20,
        color: '#999'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 5,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imagePicker: {
        width: '100%',
        height: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed'
    },
    previewImage: {
        width: '100%',
        height: '100%'
    },
    imagePickerText: {
        color: '#22687b'
    },
    saveButton: {
        backgroundColor: '#22687b',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10
    },
    disabledButton: {
        backgroundColor: '#ccc'
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})