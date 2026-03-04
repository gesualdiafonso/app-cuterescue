import React, { useEffect, useState } from "react";
import { 
    Modal, View, TextInput, 
    Text, TouchableOpacity ,
    Keyboard, Platform, TouchableWithoutFeedback,
    KeyboardAvoidingView
} from "react-native";
import { ModalContainer, StyledInput, FormBox, ButtonContainer, Button, ButtonText} from "../../../styles/modals.styles"
import { Picker } from "@react-native-picker/picker";

export default function FormDocVet({
    isOpen,
    onClose,
    onAddOrUpdate,
    initialTipo = "vacuna"
}) {
    const [ form, setForm ] = useState({
        tipo: initialTipo,
        nombre: "",
        fecha_aplicacion: "",
        fecha_vencimiento: ""
    });

    useEffect(() => {
        if(isOpen){
            setForm({
                tipo: initialTipo,
                nombre: "",
                fecha_aplicacion: "",
                fecha_vencimiento: ""
            })
        }
    }, [isOpen, initialTipo]);

    const handleSave = () =>{
        // Mapeamos el campo 'nombre' a 'nombre_vacuna' o 'nombre_medicacion' según el tipo
        const dataToSave ={
            tipo: form.tipo,
            fecha_aplicacion: form.fecha_aplicacion,
            fecha_vencimiento: form.fecha_vencimiento,
            tipo_vacuna: form.tipo === "vacuna" ? form.nombre : null,
            producto: form.tipo === "pipeta" ? form.nombre : null,
            antiparasitario: form.tipo === "antiparasitario" ? form.nombre : null,
        }

        onAddOrUpdate(dataToSave);
        onClose();
    }

    return(
        <Modal visible={isOpen} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ModalContainer>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ width: '100%', alignItems: 'center' }}
                    >
                        <FormBox>
                            <Text>Resgistrar Documentación</Text>

                            <Text>Categoría</Text>
                            <View style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                marginBottom: 15,
                                overflow: "hidden"
                            }}>
                                <Picker
                                    selectedValue={form.tipo}
                                    onValueChange={(itemValue) => setForm({...form, tipo: itemValue})}
                                >
                                    <Picker.Item label="Vacuna" value="vacuna" />
                                    <Picker.Item label="Pipeta" value="pipeta" />
                                    <Picker.Item label="Antiparasitario" value="antiparasitario" />
                                </Picker>
                            </View>

                            <Text>Nombre de {form.tipo === "vacuna" ? 'la vacuna:' : 'del producto'}</Text>
                            <StyledInput
                                placeholder="Ex: Triple Felnia / Frontiline"
                                value={form.nombre}
                                onChangeText={(t) => setForm({...form, nombre: t})}
                            />

                            <Text>Data de la Aplicación</Text>
                            <StyledInput
                                placeholder="AAAA-MM-DD"
                                value={form.fecha_aplicacion}
                                onChangeText={(t) => setForm({...form, fecha_aplicacion: t})}
                            />

                            <Text>Data de la Vencimiento</Text>
                            <StyledInput
                                placeholder="AAAA-MM-DD"
                                value={form.fecha_vencimiento}
                                onChangeText={(t) => setForm({...form, fecha_vencimiento: t})}
                            />

                            <ButtonContainer>
                                <Button onPress={onClose}>
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>

                                <Button onPress={handleSave}>
                                    <ButtonText>Salvar</ButtonText>
                                </Button>
                            </ButtonContainer>

                        </FormBox>
                    </KeyboardAvoidingView>
                </ModalContainer>
            </TouchableWithoutFeedback>
        </Modal>
    )
}