// Veterinarios 24hrs
import React, { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking, Dimensions } from "react-native"

import { Container, CardVet, CardBody, Card, TextH2 } from "../../src/styles/general.styles"

import MapVet from "../../src/components/ui/maps/MapVet";
import { getVeterinarias } from "../../src/services/veterinarias.services";
import DropdownVet from "../../src/components/ui/DropdownVet";

import { calculateDistance } from "../../src/utils/CalculateDistance";

import { locationService } from "../../src/services/location.services";
import { authService } from "../../src/services/auth.services";

export default function Vet24hrs(){

    const [userLocation, setUserLocation] = useState(null);

    const [sortedVets, setSortedVets] = useState([]);

    //const veterinarias = getVeterinarias();

    // const [selectedVet, setSelectedVet] = useState(veterinarias[0]);
    const [selectedVet, setSelectedVet] = useState({});

    const scrollViewRef = useRef(null);

    useEffect(() => {
        const loadVetsAndLocation = async () => {
            try {
                // pegar el usuario logado por pirmero
                const user = await authService.getCurrentUser();
                if (!user) throw new Error("Usuario no logado");

                const allVets = getVeterinarias();

                // 1. Intentamos obtener la ubicación del Supbabase o GPS
                const loc = await locationService.getUserLocation(user.id);
                setUserLocation(loc);

                // 2. calculamos la distancia al ordernar
                const vetsWithDistance = allVets.map(vet => ({
                    ...vet,
                    distance: calculateDistance(loc.lat, loc.lng, vet.lat, vet.lng)
                })).sort((a, b) => a.distance - b.distance);

                setSortedVets(vetsWithDistance);
                setSelectedVet(vetsWithDistance[0]);
            } catch (error) {
                console.error("Error al cargar veterinarias y ubicación:", error);
            }
        }

        loadVetsAndLocation();
    }, []);

    const handleSelectVet = (vet) => {
        setSelectedVet(vet);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const opneLink = (url) => {
        Linking.openURL(url).catch((error) => console.error("Error al abrir el link", error))
    };

    return(
        <ScrollView ref={scrollViewRef} style={{ width: "100%" }}>
            <Container>
                <View style={{ width: "100%", height: "auto"}}>
                    <MapVet 
                        lat={selectedVet.lat}
                        lng={selectedVet.lng}
                        nombre={selectedVet.nombre}
                        userLocation={userLocation}
                    />
                </View>

                <Text style={styles.header}> Veterinarios 24hrs </Text>
                <View style={{ width: "100%", marginBottom: 20 }}>
                    <Text> Elija la veterinaria mas cerca a su ubicación. </Text>
                    <DropdownVet 
                        style={{ marginTop: 10, marginBottom: 20 }}
                        vets={sortedVets}
                        onSelect={handleSelectVet}
                        selectedValue={selectedVet.id}
                    />
                </View>
                <View>
                    {sortedVets.map((vet) => (
                        <TouchableOpacity 
                            key={vet.id}
                            onPress={() => handleSelectVet(vet)}
                            activeOpacity={0.9}
                            style={[
                                styles.card,
                                selectedVet.id === vet.id && styles.selectedCard
                            ]}
                        >
                            <Image source={vet.imagenSource} style={styles.cardImage} />
                            
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>{vet.nombre}</Text>
                                <Text style={styles.info}>{vet.direccion}</Text>
                                <Text style={styles.info}>{vet.telefono}</Text>

                                <TouchableOpacity
                                    style={styles.btnMore}
                                    onPress={() => opneLink(vet.link)}
                                >
                                    <Text style={styles.btnText}>Ver más</Text>
                                </TouchableOpacity>

                            </View>

                        </TouchableOpacity>
                    ))}
                </View>
            </Container>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#22678b",
        textAlign: "left",
        marginVertical: 15,
    },
    listContainer: {
        paddingHorizontal: 15, 
        paddingBottom: 40
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 20,
        elevation: 5,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: "#22687b"
    },
    cardImage: {
        width: "40%",
        height: 180,
    },
    cardContent: {
        padding: 15,
        width: "60%"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#22687b",
        marginBottom: 5,
    },
    info: {
        color: "#444",
        marginBottom: 3,
        fontSize: 10
    },
    btnMore: {
        marginTop: 10,
        padding: 10, 
        borderWidth: 1,
        borderColor: "#22687b",
        borderRadius: 8
    },
    btnText: {
        color: "#22687b",
        fontWeight: "600"
    }
})