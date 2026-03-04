import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { Container } from "../../src/styles/general.styles";

import MapVet from "../../src/components/ui/maps/MapVet";
import DropdownVet from "../../src/components/ui/DropdownVet";

import { calculateDistance } from "../../src/utils/CalculateDistance";

// Importando os novos serviços e a função de distância corrigida
import { getVeterinarias24 } from "../../src/services/veterinaries.services";
import { locationService } from "../../src/services/location.services";
import { authService } from "../../src/services/auth.services";

import { useThemeStatus } from "../../src/contexts/ThemeContext";

export default function Vet24hrs() {
    const [userLocation, setUserLocation] = useState(null);
    const [sortedVets, setSortedVets] = useState([]);
    const [selectedVet, setSelectedVet] = useState({});
    const [loading, setLoading] = useState(true);

    const scrollViewRef = useRef(null);

    const { theme } = useThemeStatus();

    useEffect(() => {
        const loadVetsAndLocation = async () => {
            try {
                setLoading(true);
                
                // 1. Obter usuário e localização do banco
                const user = await authService.getCurrentUser();
                if (!user) throw new Error("Usuario no logado");

                const loc = await locationService.getUserLocation(user.id);
                if (!loc || !loc.lat || !loc.lng) {
                    throw new Error("Ubicación del usuario no encontrada");
                }
                setUserLocation(loc);

                // 2. Chamar o novo serviço getVeterinarias24 (Supabase)
                const allVets = await getVeterinarias24();

                // 3. Calcular distância e ordenar
                const vetsWithDistance = allVets
                    .map(vet => {
                        if (!vet.lat || !vet.lng) {
                            return { ...vet, distance: Infinity };
                        }
                        const distance = calculateDistance(
                            loc.lat,
                            loc.lng,
                            vet.lat,
                            vet.lng
                        );

                        return {
                            ...vet,
                            distance: isNaN(distance) ? Infinity : distance
                        };
                    })
                    .sort((a, b) => a.distance - b.distance); // Ordena da mais próxima para a mais longe

                setSortedVets(vetsWithDistance);
                
                // Seleciona a mais próxima por padrão
                if (vetsWithDistance.length > 0) {
                    setSelectedVet(vetsWithDistance[0]);
                }

            } catch (error) {
                console.error("Error al cargar veterinarias y ubicación:", error);
            } finally {
                setLoading(false);
            }
        };

        loadVetsAndLocation();
    }, []);

    const handleSelectVet = (vet) => {
        setSelectedVet(vet);
        // Scroll suave para o topo para ver o mapa atualizado
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const openLink = (url) => {
        if (!url) return;
        Linking.openURL(url).catch((error) => console.error("Error al abrir el link", error));
    };

    if (loading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando veterinarias cercanas...</Text>
            </Container>
        );
    }

    return (
        <ScrollView ref={scrollViewRef} style={{ width: "100%", backgroundColor: theme.backgroundColor }}>
            <Container>
                <View style={{ width: "100%" }}>
                    <MapVet 
                        lat={selectedVet.lat}
                        lng={selectedVet.lng}
                        nombre={selectedVet.nombre}
                        userLocation={userLocation}
                    />
                </View>

                <Text style={styles.header}> Veterinarios 24hrs </Text>
                
                <View style={{ width: "100%", marginBottom: 20 }}>
                    <Text style={{ marginBottom: 5 }}> 
                        Se han encontrado {sortedVets.length} clínicas cerca de ti. 
                    </Text>
                    <DropdownVet 
                        style={{ marginTop: 10, marginBottom: 20 }}
                        vets={sortedVets}
                        onSelect={handleSelectVet}
                        selectedValue={selectedVet.id}
                    />
                </View>

                <View style={{ width: "100%" }}>
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
                            {/* Ajustado para usar imagem_url do banco de dados */}
                            <Image 
                                source={{ uri: vet.imagen_url || 'https://via.placeholder.com/150' }} 
                                style={styles.cardImage} 
                            />
                            
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>{vet.nombre}</Text>
                                <Text style={styles.info}>{vet.direccion}</Text>
                                <Text style={styles.info}>{vet.telefono}</Text>
                                
                                {/* Badge de distância */}
                                <Text style={styles.distanceTag}>
                                    {vet.distance.toFixed(2)} km de distancia
                                </Text>

                                <TouchableOpacity
                                    style={styles.btnMore}
                                    onPress={() => openLink(vet.link)}
                                >
                                    <Text style={styles.btnText}>Ver más</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Container>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: '600',
        color: "#22678b",
        textAlign: "left",
        marginVertical: 15,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: "hidden",
        flexDirection: "row",
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
        fontWeight: '600',
        color: "#22687b",
        marginBottom: 5,
    },
    info: {
        color: "#444",
        marginBottom: 3,
        fontSize: 11
    },
    distanceTag: {
        fontSize: 10,
        color: "#22687b",
        fontWeight: 'bold',
        marginTop: 5
    },
    btnMore: {
        marginTop: 10,
        padding: 8, 
        borderWidth: 1,
        borderColor: "#22687b",
        borderRadius: 8,
        alignItems: 'center'
    },
    btnText: {
        color: "#22687b",
        fontWeight: '600'
    }
});