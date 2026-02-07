import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet, ScrollView } from "react-native";

import { Container, ImageRoundedAvatar, Link, TextH1, TextH2 } from "../../src/styles/general.styles";

import { useAuth } from "../../src/contexts/AuthContext"

import { userService } from "../../src/services/user.services";
import Pets from "../../src/components/Pets";
import usePetManager from "../../src/hooks/usePetManager";
import { useNavigation, useRouter } from "expo-router";
import EmergencyButton from "../../src/components/ui/EmergencyButton";
import TravelButton from "../../src/components/ui/TravelButton";

export default function Dashboard() {
    const { user } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigation = useNavigation()
    const router = useRouter()

    // Hook de pets
    const { pets, loading: loadingPets, refreshPets } = usePetManager();

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await userService.fetchProfile(user.id);
            setProfile(data);

            // despues de cargar el perfil, garantimos que los pets sea buscado
            await refreshPets();
        } catch (error) {
            Alert.alert("Error ao cargar datos de usuarios", "No se puede cargar el perfil");
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleNavegate = () =>{
        // Botón para navegar
        // navigation.navigate("/(drawer)")
        router.push("/(drawer)")
    }

    if (loading) return <ActivityIndicator size='large' style={{ flex: 1 }} />
    return (
        <ScrollView>
             <View style={styles.layoutContainer}>
                <Container>
                    <TextH1>Página de Inicio</TextH1>
                    <View style={styles.layoutImage}>
                        <ImageRoundedAvatar src={profile?.foto_url} alt={profile?.nombre + profile?.apellido} />
                    </View>
                    <TextH2>{profile?.nombre} {profile?.apellido}</TextH2>
                    <Link title="Visualizar Perfil" onPress={handleNavegate}/>

                    <View style={styles.buttonLayout}>
                        <TravelButton />
                        <EmergencyButton />
                    </View>
                </Container>
            </View>

            <View style={styles.layoutPets}>
                <Text style={styles.title}>Mascotas</Text>
                {loadingPets ? (
                    <ActivityIndicator color="#22687b" />
                ) : (
                    <Pets pets={pets} />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    layoutContainer:{
        margin: '100px auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10
    },
    layoutImage: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    layoutPets: {
        marginHorizontal: 25,
        marginVertical: 15,
        marginBottom: 15,
        justifyContent: 'center',
    },
    buttonLayout: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    }
});