import { 
    Modal, View, Text, TextInput, 
    TouchableOpacity, ScrollView, 
    ActivityIndicator, Alert, Image, StyleSheet
} from "react-native";
import { CardAdd, CardBody } from "../../styles/general.styles";
import usePetManager from "../../hooks/usePetManager";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Keyboard } from "react-native";
import usePlanLimits from "../../hooks/usePlanLimits";

export default function AddCard({ onSuccess }){
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ image, setImage] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    // 1. Instancia de hook de limits
    const { canAddPet, limits, loading: loadingLimits } = usePlanLimits();

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

    // Datos para el dropdow
    const especieData = [
        { label: 'Canino', value: 'Canino' },
        { label: 'Felino', value: 'Felino' }
    ];

    const sexoData = [
        { label: 'Macho', value: 'Macho' },
        { label: 'Hembra', value: 'Hembra' }
    ];


    // Función para selecionar una image
    const pickImage = async () => {
        // lunch de image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7
        });

        if (!result.canceled){
            setImage(result.assets[0]);
        }
    }

    // Función para trabjar sobre el cambio de fecha
    const onChangeDate = (event, selectedDate) => {
        // Se o usuário clicar em cancelar, apenas fecha o picker
        if (event.type === 'dismissed') {
            setShowPicker(false);
            return;
        }

        // CORREÇÃO: use selectedDate (o parâmetro que vem da função)
        const currentDate = selectedDate || date;
        
        // No Android, precisamos fechar manualmente após selecionar
        // setShowPicker(Platform.OS === 'ios'); 
        if (Platform.OS === 'android'){
            setShowPicker(false)
        }

        setDate(currentDate);

        // Formateando para o estado do form
        let fDate = currentDate.toISOString().split('T')[0];
        setForm({ ...form, fecha_nacimiento: fDate });
    };

    const handleOpen = () => {
        // 2. validamos si puede abrir modal
        if (!canAddPet) {
            Alert.alert(
                "Límite alcanzado",
                `Tu plan actual permite un máximo de ${limits?.max_mascotas} mascotas. Mejor tu plan para agregar más.`,
            );
            return;
        }
        setModalVisible(true);
    };

    const handleClose = () => {
        if (!isSubmitting) setModalVisible(false);
    };

    const handleSave = async () => {

        // Validamos si externamente a pasado y por seguridad estas con limites 
        if (!canAddPet){
            Alert.alert(
                "Error",
                "Has alcanzado el límite de mascotas de tu plan.",
                "Mejore su plan para que puedas agregar mas mascotas."
            )
        }

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
                if (onSuccess) await onSuccess();
                Alert.alert("Sucesso", "Mascota agregada correctamente.");
                setForm({
                    nombre: "", especie: "", raza: "", peso: "",
                    sexo: "", color: "", estado_salud: "", fecha_nacimiento: ""
                });
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
            <TouchableOpacity 
                onPress={handleOpen}
                disabled={loadingLimits}
                style={{ opacity: loadingLimits ? 0.5 : 1 }}    
            >
                <CardAdd  
                    style={{ 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor:  canAddPet ? "rgba(61, 142, 136, 0.45)" : "rgba(61, 142, 136, 0.30)"
                }}>
                    <CardBody>
                        <Text style={[styles.cardText, !canAddPet && { color: '#666' }]}>
                            {canAddPet ? "+" : "🔒"}
                        </Text>
                        <Text style={[styles.cardText, !canAddPet && { color: '#666' }]}>
                            {canAddPet ? "Agregar mascotas" : "Límite de plan alcanzado"}
                        </Text>
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
                            <Text style={styles.modalTitle}> Agregar nueva mascota</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeButton}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
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
                            <Dropdown
                                style={styles.dropdown}
                                data={especieData}
                                labelField="label"
                                valueField="value"
                                placeholder="Seleccione la especie"
                                value={form.especie}
                                onChange={item => setForm({...form, especie: item.value})}
                            />

                            <Text styles={styles.label}>Raza *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.raza} 
                                onChangeText={ (val) => setForm({ ...form, raza: val }) } 
                            />

                            <Text styles={styles.label}>Fecha de nacimiento *</Text>
                            <TouchableOpacity 
                                style={styles.input} 
                                onPress={() => {
                                    Keyboard.dismiss();
                                    console.log("Abrindo picker...")
                                    setShowPicker(true)
                                }}
                            >
                                <Text style={{ color: form.fecha_nacimiento ? '#000' : "#999" }}>
                                    {form.fecha_nacimiento || "Seleccione una fecha"}
                                </Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <View style={{ 
                                    backgroundColor: 'white', 
                                    borderRadius: 10,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#eee',
                                    }}>
                                    <DateTimePicker
                                        value={date || new Date()}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeDate}
                                        maximumDate={new Date()}
                                        style={{ height: 200}}
                                    />
                                    {Platform.OS === 'ios' && (
                                        <TouchableOpacity
                                            onPress={() => setShowPicker(false)}
                                            style={{ alignSelf: 'center', padding: 10 }}
                                        >
                                            <Text style={{ color: '#22487b', fontWeight: 600 }}>Confirmar Fecha</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* <TextInput 
                                style={styles.input} 
                                keyboardType="date"
                                value={form.fecha_nacimiento} 
                                onChangeText={ (val) => setForm({ ...form, fecha_nacimiento: val }) } 
                            /> */}

                            <Text styles={styles.label}t>Peso (kg)*</Text>
                            <TextInput 
                                style={styles.input} 
                                keyboardType="numeric"
                                value={form.peso} 
                                onChangeText={ (val) => setForm({ ...form, peso: val }) } 
                            />

                            <Text styles={styles.label}>Color *</Text>
                            <TextInput 
                                style={styles.input} 
                                value={form.color} 
                                onChangeText={ (val) => setForm({ ...form, color: val }) } 
                            />

                            <Text styles={styles.label}>Sexo *</Text>
                            <Dropdown
                                style={styles.dropdown}
                                data={sexoData}
                                labelField="label"
                                valueField="value"
                                placeholder="Seleccione el sexo"
                                value={form.sexo}
                                onChange={item => setForm({...form, sexo: item.value})}
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
                                    <Text style={styles.saveButtonText}>Guardar mascota</Text>
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
    cardText:{
        fontSize: 16,
        fontWeight: 600,
        color: "white",
        textAlign: "center"
    },
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
        fontWeight: 600,
        color: '#22687b'
    },
    closeButton: {
        fontSize: 20,
        color: '#999'
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        color: '#444',
        marginBottom: 5,
        marginTop: 15
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10
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
        borderStyle: 'dashed',
        marginBottom: 15
    },
    previewImage: {
        width: '100%',
        height: '100%'
    },
    imagePickerText: {
        color: '#22687b'
    },
    dropdown: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        marginBottom: 15,
        marginTop: 10
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
        fontWeight: 600
    }
})