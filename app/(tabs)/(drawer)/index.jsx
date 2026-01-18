// Para abrir mi perfil
import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"

import { Container, ImageRoundedAvatar, LineBottom, Stronger, TextH1, TextH3 } from "../../../src/styles/general.styles"

import { userService } from "../../../src/services/user.services"

import { useAuth } from "../../../src/contexts/AuthContext"


export default function MiPerfil(){
    const { user } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const [ loading, setLoading ] = useState(null);

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
                    <Text>Cambiar imagem</Text>
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

                <View>
                    <Text> Buttons para editar, ver mascotas y chip</Text>
                </View>
            </Container>
        </ScrollView>
    )
}