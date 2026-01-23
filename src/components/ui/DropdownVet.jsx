import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, View } from "react-native";


export default function DropdownVet({ vets, onSelect, selectedValue }) {

    const data = vets.map(v => ({
        label: `${v.nombre} (${v.distance.toFixed(1)} km)`,
        value: v.id,
    }));

    return(
        <View style={styles.container}>
            <Dropdown 
                style={styles.dropdown}
                data={data}
                labelField="label"
                valueField="value"
                value={selectedValue}
                onChange={item => {
                    const vet = vets.find(v => v.id === item.value);
                    onSelect(vet);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        peddingVertical: 10,
        width: '100%',
    },
    dropdown: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#555",
    },
});