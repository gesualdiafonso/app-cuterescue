// Pagina de Documentación veterinarios
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
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

export default function DocVet(){

    const { pets, refreshPets } = usePetManager();
    const { docs, loading, saveDoc, selectedPet } = useDocumentation();
    const [ modalOpen, setModalOpen ] = React.useState(false);

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

    return(
        <ScrollView>
            <Container>
                <TextH2>Documentación Veterinarias</TextH2>
                {/* Dropdown para seleccionar la mascota */}

                <DropdownSelect pets={pets} />

                {loading ? (
                    <ActivityIndicator size="large" color="#22687B" />
                ) : selectedPet ? (
                    // Verificamos si hay documentos
                    <>
                        {[...docs.vacunas, ...docs.presentacion, ...docs.antiparasitarios].length > 0 ? ( 
                            [...docs.vacunas, ...docs.presentacion, ...docs.antiparasitarios].map((item) => (
                                <DocCard key={item.id}>
                                    <CardHeader>
                                        <View>
                                            <LabelText>
                                                <Stronger> 
                                                    {item.tipo === 'vacuna' ? 'Vacuna: ' : 
                                                        item.tipo === 'pipeta' ? 'Producto: ' : 'Antiparasitario: '}
                                                </Stronger> 
                                                <Text>
                                                    {item.tipo_vacuna || item.producto || item.antiparasitario}
                                                </Text>
                                            </LabelText>
                                            <LabelText><Stronger>Fecha de aplicación:</Stronger></LabelText>
                                            <ValueText>{item.fecha_aplicacion}</ValueText>
                                            <LabelText><Stronger>Fecha de vencimiento:</Stronger></LabelText>
                                            <ValueText>{item.fecha_vencimiento}</ValueText>
                                        </View>

                                        <View style={{ alignItems: 'flex-end'}}>
                                            <LabelText style={{ marginBottom: 5 }}>Alerta:</LabelText>
                                            <Badge status={item.alerta}>
                                                <BadgeText>{item.alerta}</BadgeText>
                                            </Badge>
                                        </View>
                                    </CardHeader>

                                    <InfoButton>
                                        <BadgeText style={{ fontSize: 12 }}>Ver información</BadgeText>
                                    </InfoButton>
                                </DocCard>
                            ))
                        ) : (
                            <Text>No hay registro de vacunación de mascotas agregadas.</Text>
                        )}
                        <AddCard onPress={() => setModalOpen(true)}>
                            <Text>+</Text>
                            <Text>Agregar vacunas</Text>
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
            </Container>
        </ScrollView>
    )
}