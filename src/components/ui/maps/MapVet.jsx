import React, { useEffect, useRef } from "react";

import { StyleSheet, View, Text } from "react-native";

import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import { BaseMap, MapContainer } from "../../../styles/maps.styles";


export default function MapVet({ lat, lng, nombre, userLocation }){
    const mapRef = useRef(null);

    useEffect(() => {
        if (lat && lng && mapRef.current){
            // Ajustamos el zoom para que muestra ambos los puntos si haber location
            if (userLocation){
                mapRef.current.fitToCoordinates([
                    { latitude: lat, longitude: lng },
                    { latitude: userLocation.lat, longitude: userLocation.lng }
                ], {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            } else{
                mapRef.current.animateToRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.005,
                    logintudeDelta: 0.005,
                }, 1000)
            }
            
        }
    }, [lat, lng, userLocation]);

    return(
        <MapContainer>
            <BaseMap
                ref={mapRef}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={{ latitude: lat, longitude: lng}}>
                    <Callout>
                        <View style={{padding: 5}}>
                            <Text style={{ fontWeight: "bold" }}>{nombre}</Text>
                        </View>
                    </Callout>
                </Marker>

                {userLocation && (
                    <>
                        <Marker 
                            coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
                            pinColor="#22678b"
                            title="Tu ubiación"
                        />

                        <Polyline 
                            coordinate={[
                                { latitude: userLocation.lat, longitude: userLocation.lng },
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