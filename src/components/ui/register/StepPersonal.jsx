import React, { useState } from "react";
import { AreaInput, Input, Button, ButtonText } from "../../../styles/forms.styles";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import { Alert, StyleSheet } from "react-native";

export default function StepPersonal({ data, onNext, onBack }){
    const [localData, setLocalData] = useState(data);
    const [isFocus, setIsFocus] = useState(false);

    // Datos
    const docTypes =[
        { label: 'DNI', value: 'DNI' },
        { label: 'Pasaporte', value: 'PASAPORTE' },
        { label: 'CUIL', value: 'CUIL' },
    ];

    const handleNext = () => {
        if (!localData.nombre || !localData.apellido || !localData.documento) {
            return Alert.alert("Campos incompletos", "Por favor, completar todos los campos!")
        }

        onNext(localData);
    }

    return (
        <>
            <AreaInput>
                <Input 
                    placeholder="Nombre"
                    value={localData.nombre}
                    onChangeText={(t) => setLocalData({...localData, nombre: t})}
                />
            </AreaInput>

            <AreaInput>
                <Input 
                    placeholder="Apellid"
                    value={localData.apellido}
                    onChangeText={(t) => setLocalData({...localData, apellido: t})}
                />
            </AreaInput>

            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#FF8C00' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={docTypes}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Tipo de Documento' : '...'}
                value={localData.tipoDocumento}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setLocalData({...localData, tipoDocumento: item.value});
                    setIsFocus(false);
                }}
            />

            <AreaInput>
                <Input 
                    placeholder="Número de documento" 
                    keyboardType="numeric"
                    value={localData.documento} 
                    onChangeText={(t) => setLocalData({...localData, documento: t})} 
                />
            </AreaInput>

            <Button onPress={handleNext}>
                <ButtonText>Siguiente</ButtonText>
            </Button>
            <Button style={{backgroundColor: '#666'}} onPress={onBack}>
                <ButtonText>Volver</ButtonText>
            </Button>
        </>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 15, // Ajuste conforme seu FormArea
        width: '100%',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})