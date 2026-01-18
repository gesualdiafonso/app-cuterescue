// Veterinarios 24hrs
import React, { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking, Dimensions } from "react-native"

import { Container, CardVet, CardBody, Card, TextH2 } from "../../src/styles/general.styles"

import MapVet from "../../src/components/ui/maps/MapVet";
import { getVeterinarias } from "../../src/services/veterinarias.services";

export default function Vet24hrs(){

    const veterinarias = getVeterinarias();

    const [selectedVet, setSelectedVet] = useState(veterinarias[0]);

    const scrollViewRef = useRef(null);

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
                    />
                </View>

                <Text style={styles.header}> Veterinarios 24hrs </Text>

                <View>
                    {veterinarias.map((vet) => (
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