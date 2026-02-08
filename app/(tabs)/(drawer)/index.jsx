// Para abrir mi perfil
import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"

import { Container, ImageRoundedAvatar, LineBottom, Stronger, TextH1, TextH3 } from "../../../src/styles/general.styles"

import { userService } from "../../../src/services/user.services"

import { useAuth } from "../../../src/contexts/AuthContext"

import EditInform from "../../../src/components/ui/modals/EditInform"

import { Button, TouchableOpacity } from "react-native"

import * as ImagePicker from 'expo-image-picker';

export default function MiPerfil(){
    const { user } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false)


    const loadData = async () => {
        try {
            setLoading(true);
            const data = await userService.fetchProfile(user.id);
            setProfile(data);
        } catch (error) {
            Alert.alert("Erro al cargar las información de perfil!")
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleChangeImage = async () => {
        // Pedir permisión 
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted'){
            Alert.alert("Permiso denegado", "Necesitamos acceso a las fotos.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            try{
                setLoading(true);
                const selectedImage = result.assets[0];

                // Llamamos el mismo servicio, enviando los datos
                await userService.editProfile(user.id, profile, selectedImage);

                Alert.alert("Éxito", "No se puede actualizar la foto.");
                loadData();
            } catch (error){
                Alert.alert("Error", "No se puede actulizar la foto.");
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return(
        <ScrollView>
            <Container>
                <View style={{ width: 150, height: 150 }}>
                    <ImageRoundedAvatar src={profile?.foto_url} alt={profile?.nombre + " " + profile?.apellido} />
                </View>

                <View >
                    {/* Botão de trocar imagem ativado */}
                    <TouchableOpacity onPress={handleChangeImage} style={{ marginTop: 10, alignItems: 'center' }}>
                        <Text style={{ color: '#4A90E2', fontWeight: 'bold' }}>Cambiar imagen</Text>
                    </TouchableOpacity>
                    <TextH1>{profile?.nombre + " " + profile?.apellido}</TextH1>
                </View>

                <LineBottom />

                <View>
                    <TextH3>Información Personal</TextH3>

                    <View>
                        <Text><Stronger>Fecha de nacimiento: </Stronger> <Text>{profile?.fechaNacimiento}</Text></Text>
                        <Text><Stronger>Genero: </Stronger> <Text>{profile?.genero}</Text></Text>
                        <Text><Stronger>Email: </Stronger> <Text>{profile?.email}</Text></Text>
                        <Text><Stronger>Telefono: </Stronger> <Text>{profile?.telefono}</Text></Text>
                        <Text><Stronger>Documento: </Stronger> <Text>{profile?.tipoDocumento + ": " + profile?.documento}</Text></Text>
                        <Text><Stronger>Plan: </Stronger> <Text>valor del plan contractado</Text></Text>
                        <Text><Stronger>Numero de mascotas activas: </Stronger> <Text>mascotas por id user</Text></Text>
                        <Text><Stronger>Tags Activas: </Stronger> <Text>null</Text></Text>
                        <Text><Stronger>Ubicación: </Stronger><Text>{profile?.direccion + ", " + profile?.provincia}</Text></Text>
                    </View>
                </View>

                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity 
                        onPress={() => setModalVisible(true)}
                        style={{ backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>EDITAR PERFIL</Text>
                    </TouchableOpacity>
                </View>

                {/* MODAL DE EDIÇÃO */}
                <EditInform 
                    visible={isModalVisible} 
                    onClose={() => setModalVisible(false)}
                    profileData={profile}
                    onUpdateSuccess={loadData} // Recarrega a tela ao salvar
                />

            </Container>
        </ScrollView>
    )
}