import React, { useRef, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from "react-native-maps";
import { StyleSheet, View, Image, Platform } from "react-native";
import { useSavedData } from "../contexts/SaveDataContext";

export default function Maps({ location, petPhoto }) {

    const mapRef = useRef(null);

    const { userLocation } = useSavedData();

    const region = {
        latitude: location?.lat ?? -34.5711,
        longitude: location?.lng ?? -58.4233,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const animatedRegion = useRef(
        new AnimatedRegion({
            latitude: location?.lat ?? -34.5711,
            longitude: location?.lng ?? -58.4233,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        })
    ).current;

    useEffect(() => {
        if (location?.lat && location?.lng) {
            // 1. Move o marcador (o ícone do pet) suavemente
            animatedRegion.timing({
                latitude: location.lat,
                longitude: location.lng,
                duration: 3500, // Um pouco menos que os 5s da simulação para não atrasar
                useNativeDriver: false,
            }).start();

            // 2. Move a câmera do mapa para seguir o pet
            if (mapRef.current) {
                mapRef.current.animateCamera({
                    center: {
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                    pitch: 0,
                    heading: 0,
                    altitude: 1000,
                    zoom: 17,
                }, { duration: 2000 });
            }
        }
    }, [location]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                style={styles.map}
                initialRegion={region}
            >
                {location?.lat && location?.lng && (
                    <Marker.Animated coordinate={animatedRegion}>
                        <View style={styles.pin}>
                            <Image
                                source={{ uri: petPhoto }}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </View>
                    </Marker.Animated>
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    pin: {
        width: 45,
        height: 45,
        borderRadius: 22,
        backgroundColor: "#22687b",
        borderWidth: 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    markerContainer: {
        width: '100%',
        height: '100%',
    },
})