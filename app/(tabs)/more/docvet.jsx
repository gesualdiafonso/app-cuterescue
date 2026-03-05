// Pagina de Documentación veterinarios
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { View, Text } from "react-native";
import { 
    Container, Stronger, TextH2, 
    DocCard, CardHeader, LabelText, 
    ValueText, Badge, BadgeText, InfoButton, 
    AddCard 
} from "../../../src/styles/general.styles";
import useDocumentation from '../../../src/hooks/useDocumentationManager';
import FormDocVet from '../../../src/components/ui/modals/FormDocVet';
import DropdownSelect from '../../../src/components/ui/DropdownSelect';
import usePetManager from '../../../src/hooks/usePetManager';
import * as Notifications from 'expo-notifications';
import InfoDocPet from '../../../src/components/ui/modals/InfoDocPet';
import usePlanLimits from '../../../src/hooks/usePlanLimits';

export default function DocVet(){

    const { pets, refreshPets, setSelectedPet } = usePetManager();
    const { docs, loading, saveDoc, removeDoc, selectedPet } = useDocumentation();
    const [ modalOpen, setModalOpen ] = React.useState(false);

    const { canAddDocument, limits, loading: loadingLimits } = usePlanLimits();

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const handleOpenInfo = (item) => {
        setSelectedDoc(item);
        setInfoModalOpen(true);
    }

    // Garantimos que el pet sea cargado
    useEffect(() => {
        async function requestPermissions(){
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted'){
                await Notifications.requestPermissionsAsync();
            }
        }
        requestPermissions();
        refreshPets();
    }, []);

    useEffect(() => {
        if (pets.length > 0 && !selectedPet) {
            console.log("Forçando seleção do primeiro pet:", pets[0].nombre);
            setSelectedPet(pets[0]);
        }
    }, [pets, selectedPet]);

    const allDocs = [
        ...(docs?.vacunas || []), 
        ...(docs?.presentacion || []), 
        ...(docs?.desparasitacion || [])
    ];

    const handleOpenAddModal = () => {
        if (!selectedPet) {
            Alert.alert("Atención", "Seleccione una mascota primero")
            return;
        }

        // Verficiamos si el total de documentación actuales ultrapasa su limite 
        if (!canAddDocument(allDocs.length)) {
            Alert.alert(
                "Límite de documentos",
                `Tu plan actual permite un máximo de ${limits?.slots_documentacion} documentos por mascota. ¡Mejora tu plan para agregar más!`
            );
            return;
        }

        setModalOpen(true);
    }

    return(
        <ScrollView>
            <Container>
                <TextH2>Documentación veterinarias</TextH2>
                {/* Dropdown para seleccionar la mascota */}

                <DropdownSelect pets={pets} />

                {loading || loadingLimits ? (
                    <ActivityIndicator size="large" color="#22687B" />
                ) : selectedPet ? (
                    // Verificamos si hay documentos
                    <>
                        {allDocs.length > 0 ? (
                                allDocs.map((item) => (
                                    <DocCard key={item.id}>
                                        <CardHeader>
                                            <View style={{ flex: 1 }}>
                                                <LabelText style={{ marginBottom: 10 }}>
                                                    <Stronger style={{ color: 'white'}}> 
                                                        {item.tipo === 'vacuna' ? 'Vacuna: ' : 
                                                            item.tipo === 'pipeta' ? 'Antipulga: ' : 'Antiparasitario: '}
                                                    </Stronger> 
                                                    <Text>
                                                        {item.tipo_vacuna || item.producto || item.desparasitacion || 'N/A'}
                                                    </Text>
                                                </LabelText>
                                                <LabelText><Stronger style={{ color: 'white'}}>Fecha de aplicación:</Stronger></LabelText>
                                                <ValueText>{item.fecha_aplicacion}</ValueText>
                                                <LabelText><Stronger style={{ color: 'white'}}>Fecha de vencimiento:</Stronger></LabelText>
                                                <ValueText>{item.fecha_vencimiento}</ValueText>
                                            </View>

                                            {/* <View style={{ alignItems: 'flex-end'}}>
                                                <LabelText style={{ marginBottom: 5 }}>Alerta:</LabelText>
                                                <Badge status={item.alerta}>
                                                    <BadgeText>{item.alerta}</BadgeText>
                                                </Badge>
                                            </View> */}
                                        </CardHeader>

                                        <InfoButton onPress={() => handleOpenInfo(item)}>
                                            <BadgeText style={{ fontSize: 12 }}>Ver información</BadgeText>
                                        </InfoButton>
                                    </DocCard>
                                ))
                            ) : (
                            <Text style={{ marginVertical: 20, textAlign: 'center' }}>No hay registro de vacunación de mascotas agregadas.</Text>
                        )}
                        <AddCard 
                            style={{ 
                                width: "100%",
                                backgroundColor: canAddDocument(allDocs.length) ? "rgb(255, 190, 120)" : "rgba(251, 190, 120, 0.65)"
                            }} 
                            onPress={handleOpenAddModal}
                            
                        >
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 300 }}>
                                {canAddDocument(allDocs.length) ? "+" : "🔒"}
                            </Text>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 300 }}>
                                {canAddDocument(allDocs.length) ? "Agregar documentación" : "Límite alcanzado"}
                            </Text>
                        </AddCard>
                    </>
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        Por favor, selecciona una mascota para ver seus documentos.
                    </Text>
                )}


                <FormDocVet 
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onAddOrUpdate={(data) => {
                        saveDoc(data);
                        setModalOpen(false);
                    }}
                    tipo="vacuna"
                />

                <InfoDocPet 
                    isOpen={infoModalOpen}
                    item={selectedDoc}
                    onClose={() => {
                        setInfoModalOpen(false);
                        setSelectedDoc(null);
                    }}
                    onUpdate={(data, id) => saveDoc(data, id)}
                    onDelete={(id) => removeDoc(id)}
                />
            </Container>
        </ScrollView>
    )
}