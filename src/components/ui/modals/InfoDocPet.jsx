import React, { useState } from 'react';
import { Modal, Text, View, Alert } from 'react-native';
import { 
    ModalContainer, FormBox, ButtonContainer, 
    Button, ButtonText, StyledInput 
} from "../../../styles/modals.styles";

import { Stronger, Paragraph } from "../../../styles/general.styles";

export default function ModalInfoDoc({ isOpen, onClose, item, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Al entrar en modo edición, cargamos los datos actuales
    const handleStartEdit = () => {
        setEditForm({
            ...item,
            nombre: item.tipo_vacuna || item.producto || item.antiparasitario
        });
        setIsEditing(true);
    };

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar Registro",
            "¿Estás seguro de que deseas eliminar este documento?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => {
                    onDelete(item.id);
                    onClose();
                }}
            ]
        );
    };

    const handleSaveEdit = () => {
        const { nombre, ...resetOfData } = editForm;

        const dataToSave = {
            ...resetOfData,
            tipo_vacuna: item.tipo === "vacuna" ? nombre : null,
            producto: item.tipo === "pipeta" ? nombre : null,
            antiparasitario: item.tipo === "antiparasitario" ? nombre : null,
        };
        onUpdate(dataToSave, item.id);
        setIsEditing(false);
        onClose();
    };

    if (!item) return null;

    return (
        <Modal visible={isOpen} transparent animationType="slide">
            <ModalContainer>
                <FormBox>
                    <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 15 }}>
                        {isEditing ? "Editar Documento" : "Información del Documento"}
                    </Text>

                    {isEditing ? (
                        <>
                            <Text>Nombre</Text>
                            <StyledInput 
                                value={editForm.nombre} 
                                onChangeText={(t) => setEditForm({...editForm, nombre: t})}
                            />
                            <Text>Fecha Aplicación</Text>
                            <StyledInput 
                                value={editForm.fecha_aplicacion} 
                                onChangeText={(t) => setEditForm({...editForm, fecha_aplicacion: t})}
                            />
                            <Text>Fecha Vencimiento</Text>
                            <StyledInput 
                                value={editForm.fecha_vencimiento} 
                                onChangeText={(t) => setEditForm({...editForm, fecha_vencimiento: t})}
                            />
                        </>
                    ) : (
                        <View style={{ marginBottom: 20 }}>
                            <Paragraph style={{ color: 'black' }}><Stronger style={{fontWeight: 600}}>Tipo:</Stronger> {item.tipo}</Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger style={{fontWeight: 600}}>Nombre:</Stronger> {item.tipo_vacuna || item.producto || item.antiparasitario}</Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger style={{fontWeight: 600}}>Aplicación:</Stronger> {item.fecha_aplicacion}</Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger style={{fontWeight: 600}}>Vencimiento:</Stronger> {item.fecha_vencimiento}</Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger style={{fontWeight: 600}}>Estado:</Stronger> {item.alerta}</Paragraph>
                        </View>
                    )}

                    <ButtonContainer>
                        {isEditing ? (
                            <>
                                <Button onPress={() => setIsEditing(false)} style={{ borderColor: '#f76e2a', borderWidth: 1, borderRadius: 10 }}>
                                    <ButtonText style={{ color: '#f76e2a', paddingHorizontal: 20, paddingVertical: 10 }}>Cancelar</ButtonText>
                                </Button>
                                <Button onPress={handleSaveEdit} style={{ backgroundColor: '#22687B', borderRadius: 10}}>
                                    <ButtonText style={{ color: 'white', paddingHorizontal: 20, paddingVertical: 10 }}>Guardar</ButtonText>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onPress={handleStartEdit} style={{ backgroundColor: '#22687B', borderRadius: 10}}>
                                    <ButtonText style={{ color: 'white', paddingHorizontal: 20, paddingVertical: 10 }}>Editar</ButtonText>
                                </Button>
                                <Button onPress={confirmDelete} style={{ borderColor: '#f76e2a', borderWidth: 1, borderRadius: 10 }}>
                                    <ButtonText style={{ color: '#f76e2a', paddingHorizontal: 20, paddingVertical: 10 }}>Eliminar</ButtonText>
                                </Button>
                                <Button onPress={onClose} style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black', borderRadius: 10 }}>
                                    <ButtonText style={{ color: '#000', paddingHorizontal: 20, paddingVertical: 10 }}>Cerrar</ButtonText>
                                </Button>
                            </>
                        )}
                    </ButtonContainer>
                </FormBox>
            </ModalContainer>
        </Modal>
    );
}