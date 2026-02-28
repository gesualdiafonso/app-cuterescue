import React, { useRef, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Image, Platform } from "react-native";

export default function Maps({ location, petPhoto }) {

    const mapRef = useRef(null);

    const region = {
        latitude: location?.lat ?? -34.5711,
        longitude: location?.lng ?? -58.4233,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    useEffect(() => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion(region, 800);
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
                    <Marker coordinate={{ latitude: location.lat, longitude: location.lng }}>
                        <View style={styles.pin}>
                            <Image
                                source={{ uri: petPhoto }}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </View>
                    </Marker>
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