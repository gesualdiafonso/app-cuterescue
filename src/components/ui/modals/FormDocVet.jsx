import React, { useState } from "react";
import { Modal, View, TextInput, Text, TouchableOpacity } from "react-native";
import { ModalContainer, StyledInput, FormBox, ButtonContainer, Button, ButtonText} from "../../../styles/modals.styles"

export default function FormDocVet({
    isOpen,
    onClose,
    onAddOrUpdate,
    tipo
}) {
    const [ form, setForm ] = useState({});

    return(
        <Modal visible={isOpen} transparent animationType="fade">
            <ModalContainer>
                <FormBox>
                    <Text>Resgistrar {tipo}</Text>

                    <Text>Nombre de la medicación/vacuna</Text>
                    <StyledInput
                        placeholder="Ex: Triple Felnia"
                        onChangeText={(t) => setForm({...form, nombre: t})}
                    />

                    <Text>Data de la Aplicación</Text>
                    <StyledInput
                        placeholder="DD/MM/AAAA"
                        onChangeText={(t) => setForm({...form, fecha_aplicacion: t})}
                    />

                    <Text>Data de la Vencimiento</Text>
                    <StyledInput
                        placeholder="DD/MM/AAAA"
                        onChangeText={(t) => setForm({...form, fecha_vencimiento: t})}
                    />

                    <ButtonContainer>
                        <Button onPress={onClose}>
                            <ButtonText>Cancelar</ButtonText>
                        </Button>

                        <Button onPress={() => onAddOrUpdate(form)}>
                            <ButtonText>Salvar</ButtonText>
                        </Button>
                    </ButtonContainer>

                </FormBox>
            </ModalContainer>
        </Modal>
    )
}