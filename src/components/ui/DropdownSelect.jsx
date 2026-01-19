import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useSavedData } from "../../contexts/SaveDataContext";
import { StyleSheet, View } from "react-native";


export default function DropdownSelect({ pets }) {
    const { selectedPet, setSelectedPet } = useSavedData();

    // Mapeando los pets para el formato que el componente Dropdown espera
    const data = pets.map(pet => ({
        label: pet.nombre,
        value: pet.id,
    }));

    return(
        <View style={styles.container}>
            <Dropdown 
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Seleccione una mascota"
                value={selectedPet?.id}
                onChange={ item => {
                    // Econtramos el objeto pet completo para que sea salvado en contexto
                    const mascotas = pets.find(p => p.id === item.value);
                    setSelectedPet(mascotas);
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