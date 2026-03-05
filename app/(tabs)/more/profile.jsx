// Para abrir mi perfil
import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"

import { Container, ImageRoundedAvatar, LineBottom, Stronger, TextH1, TextH3, Paragraph } from "../../../src/styles/general.styles"

import { userService } from "../../../src/services/user.services"

import { useAuth } from "../../../src/contexts/AuthContext"

import EditInform from "../../../src/components/ui/modals/EditInform"

import { Button, TouchableOpacity, StyleSheet } from "react-native"

import * as ImagePicker from 'expo-image-picker';

import usePetManager from "../../../src/hooks/usePetManager"
import { useRouter } from "expo-router"
import usePlanLimits from "../../../src/hooks/usePlanLimits"

export default function MiPerfil(){
    const { user } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const { pets } = usePetManager();
    const { planNameFormatted } = usePlanLimits();
    const [ loading, setLoading ] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const router = useRouter();


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
            // mediaTypes: [ImagePicker.MediaType.Images],            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            try{
                setLoading(true);
                const asset = result.assets[0];

                const fileToUpload = {
                    uri: asset.uri,
                    name: asset.fileName || `avatar_${Date.now()}.jpg`,
                    type: asset.mimeType || asset.type || 'image/jpeg'
                }

                // Llamamos el mismo servicio, enviando los datos
                await userService.editProfile(user.id, profile, fileToUpload);
                
                loadData();

                Alert.alert("Éxito", "Foto actualizada correctamente.");
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
                    <ImageRoundedAvatar source={{ uri: profile?.foto_url}} alt={profile?.nombre + " " + profile?.apellido} />
                </View>

                <View >
                    {/* Botão de trocar imagem ativado */}
                    <TouchableOpacity onPress={handleChangeImage} style={{ marginTop: 10, alignItems: 'center' }}>
                        <Text style={{ color: '#4A90E2', fontWeight: 600 }}>Cambiar imagen</Text>
                    </TouchableOpacity>
                    <TextH1 style={{ marginTop: 15, marginBottom: 20 }}>{profile?.nombre + " " + profile?.apellido}</TextH1>
                </View>

                <LineBottom />

                <View style={{ width: '100%'}}>
                    <TextH3>Información personal</TextH3>

                    <View style={{ marginTop: 15, marginBottom: 20 }}>
                        <Paragraph style={{ color: 'black' }}><Stronger>Fecha de nacimiento: </Stronger> <Text>{profile?.fechaNacimiento}</Text></Paragraph>
                        <Paragraph style={{ color: 'black' }}><Stronger>Género: </Stronger> <Text>{profile?.genero}</Text></Paragraph>
                        <Paragraph style={{ color: 'black' }}><Stronger>Email: </Stronger> <Text>{profile?.email}</Text></Paragraph>
                        <Paragraph style={{ color: 'black' }}><Stronger>Teléfono: </Stronger> <Text>{profile?.telefono}</Text></Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger>Documento {profile?.tipoDocumento}: </Stronger> <Text>{profile?.documento}</Text></Paragraph>
                            <Paragraph style={{ color: 'black' }}><Stronger>Plan: </Stronger> <Text>{planNameFormatted}</Text></Paragraph>
                        <Paragraph style={{ color: 'black' }}><Stronger>Cantidad de mascotas: </Stronger> <Text>{pets ? pets.length : 0}</Text></Paragraph>
                        <Paragraph style={{ color: 'black' }}><Stronger>Ubicación: </Stronger><Text>{profile?.direccion + ", " + profile?.provincia}</Text></Paragraph>
                    </View>
                </View>

                <View style={{ width: "100%", marginTop: 20 }}>
                    <TouchableOpacity 
                        onPress={() => setModalVisible(true)}
                        style={styles.buttonEdit}
                    >
                        <Text style={{ width: "100%", color: 'black', fontSize: 18, fontWeight: 600, textAlign: "center" }}>Editar información</Text>
                    </TouchableOpacity>

                    <View style={{ width: "100%", margin: 10, flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", padding: 10}}>
                        <TouchableOpacity 
                            onPress={() => router.push("/(tabs)/more/informpet")}
                            style={[styles.buttonEdit, { width: "50%", marginRight: 10, backgroundColor: "#22687B", borderColor: "#22687B" }]}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 600, textAlign: "center" }}>Ver mascotas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => router.push("/(tabs)/more/viewplan")}
                            style={[styles.buttonEdit, { width: "50%", marginLeft: 5, marginRight: 15, backgroundColor: "#FF8C09", borderColor: "#FF8C09" }]}
                        >
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 600, textAlign: "center" }}>Ver Plan</Text>
                        </TouchableOpacity>
                    </View>

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

const styles = StyleSheet.create({
    buttonEdit: {
        width: "100%",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    }
})