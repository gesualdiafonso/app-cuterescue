import React from "react";
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Image } from "react-native";

export default function Maps({ location, petPhoto }) {
    // Coordenadas por default (Buenos Aires) caso no haya location
    const initialRegion = {
        latitude: location?.lat || -34.5711,
        longitude: location?.lng || -58.4233,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={styles.container}> 
            <MapView
                style={styles.map}
                region={location ? {
                    ...initialRegion,
                    latitude: location.lat,
                    longitude: location.lng,
                } : initialRegion}
            >
                <UrlTile
                    urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" // Corrigido: tile
                    maximumZ={19}
                    flipY={false}
                />

                {location?.lat && location?.lng && (
                    <Marker coordinate={{ latitude: location.lat, longitude: location.lng }} >
                        <View style={styles.pin}> 
                            <Image 
                                source={{ uri: petPhoto }} 
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                    </Marker>
                )}
            </MapView>
        </View>
    )
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
        borderRadius: 22.2,
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