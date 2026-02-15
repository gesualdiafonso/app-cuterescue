import React, { useState } from 'react';
import { Modal, Text, View, Alert } from 'react-native';
import { 
    ModalContainer, FormBox, ButtonContainer, 
    Button, ButtonText, StyledInput 
} from "../../../styles/modals.styles";

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
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
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
                            <Text><Text style={{fontWeight: 'bold'}}>Tipo:</Text> {item.tipo}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Nombre:</Text> {item.tipo_vacuna || item.producto || item.antiparasitario}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Aplicación:</Text> {item.fecha_aplicacion}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Vencimiento:</Text> {item.fecha_vencimiento}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Estado:</Text> {item.alerta}</Text>
                        </View>
                    )}

                    <ButtonContainer>
                        {isEditing ? (
                            <>
                                <Button onPress={() => setIsEditing(false)} style={{ backgroundColor: '#ccc' }}>
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>
                                <Button onPress={handleSaveEdit}>
                                    <ButtonText>Guardar</ButtonText>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onPress={handleStartEdit} style={{ backgroundColor: '#22687B' }}>
                                    <ButtonText>Editar</ButtonText>
                                </Button>
                                <Button onPress={confirmDelete} style={{ backgroundColor: '#FF4444' }}>
                                    <ButtonText>Eliminar</ButtonText>
                                </Button>
                                <Button onPress={onClose} style={{ backgroundColor: '#eee' }}>
                                    <ButtonText style={{ color: '#000' }}>Cerrar</ButtonText>
                                </Button>
                            </>
                        )}
                    </ButtonContainer>
                </FormBox>
            </ModalContainer>
        </Modal>
    );
}