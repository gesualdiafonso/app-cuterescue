import React from "react";

import { View, StyleSheet } from "react-native";

import MapView, { Marker } from "react-native-maps";

export default function MapHome(){
    return(
        <View style={styles.container}>
            <MapView style={styles.map}>
                <Marker />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    map: {},
    
})