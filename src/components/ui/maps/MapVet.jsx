import React, { useEffect, useRef } from "react";

import { StyleSheet, View, Text } from "react-native";

import MapView, { Marker, Callout } from "react-native-maps";
import { BaseMap, MapContainer } from "../../../styles/maps.styles";


export default function MapVet({ lat, lng, nombre }){
    const mapRef = useRef(null);

    useEffect(() => {
        if (lat && lng && mapRef.current){
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.005,
                logintudeDelta: 0.005,
            }, 1000)
        }
    }, [lat, lng]);

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
            </BaseMap>
        </MapContainer>
    );
}