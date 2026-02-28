import React, { useEffect, useRef, useMemo } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import { BaseMap, MapContainer } from "../../../styles/maps.styles";

export default function MapVet({ lat, lng, nombre, userLocation }) {

    const mapRef = useRef(null);

    // ✅ Região segura com fallback (nunca undefined)
    const region = useMemo(() => ({
        latitude: typeof lat === "number" ? lat : -34.5711,
        longitude: typeof lng === "number" ? lng : -58.4233,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }), [lat, lng]);

    useEffect(() => {

        if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            mapRef.current
        ) {

            if (
                userLocation &&
                typeof userLocation.lat === "number" &&
                typeof userLocation.lng === "number"
            ) {

                mapRef.current.fitToCoordinates(
                    [
                        { latitude: lat, longitude: lng },
                        { latitude: userLocation.lat, longitude: userLocation.lng }
                    ],
                    {
                        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
                        animated: true,
                    }
                );

            } else {

                mapRef.current.animateToRegion(
                    {
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    },
                    800
                );
            }
        }

    }, [lat, lng, userLocation]);

    return (
        <MapContainer>
            <BaseMap
                ref={mapRef}
                initialRegion={region}
            >

                {/* 📍 Veterinaria */}
                {typeof lat === "number" && typeof lng === "number" && (
                    <Marker coordinate={{ latitude: lat, longitude: lng }}>
                        <Callout>
                            <View style={{ padding: 5 }}>
                                <Text style={{ fontWeight: "600" }}>
                                    {nombre}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                )}

                {/* 👤 Usuario */}
                {userLocation &&
                    typeof userLocation.lat === "number" &&
                    typeof userLocation.lng === "number" && (
                        <>
                            <Marker
                                coordinate={{
                                    latitude: userLocation.lat,
                                    longitude: userLocation.lng
                                }}
                                pinColor="#22678b"
                                title="Tu ubicación"
                            />

                            <Polyline
                                coordinates={[
                                    {
                                        latitude: userLocation.lat,
                                        longitude: userLocation.lng
                                    },
                                    { latitude: lat, longitude: lng }
                                ]}
                                strokeColor="#22778b"
                                strokeWidth={3}
                                lineDashPattern={[5, 5]}
                            />
                        </>
                    )}

            </BaseMap>
        </MapContainer>
    );
}