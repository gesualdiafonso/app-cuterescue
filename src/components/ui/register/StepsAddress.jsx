import React, { useState } from "react";
import { AreaInput, Input, Button, ButtonText } from "../../../styles/forms.styles";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import { Alert, StyleSheet } from "react-native";

export default function StepAddress({ data, onNext, onBack }){
    const [localData, setLocalData] = useState(data);
    const [isFocus, setIsFocus] = useState(false);

    // Datos
    const provincias = [
        { label: 'Capital Federa', value: 'Capital Federal'},
        { label: 'GBA Norte', value: 'GBA Norte'},
        { label: 'GBA Sur', value: 'GBA Sur'},
        { label: 'GBA Oeste', value: 'GBA Oeste'},
        { label: 'Buenos Aires Interior', value: 'Buenos Aires Interior'},
    ]

    const handleNext = () => {
            if (!localData.direccion || !localData.codigoPostal || !localData.provincia) {
                return Alert.alert("Campos incompletos", "Por favor, completar todos los campos!")
            }
    
            onNext(localData);
        }
    return(
        <>
            <AreaInput>
                <Input
                    placeholder="Dirección"
                    keyboradType="words"
                    autoCapitalize="true"
                    value={localData.direccion}
                    onChangeText={(t) => setLocalData({...localData, direccion: t})}
                />
            </AreaInput>

            {/* Dropdown para provincias */}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#FF8C00' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={provincias}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Seleccione la provincia' : '...'}
                value={localData.provincia}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setLocalData({...localData, provincia: item.value});
                    setIsFocus(false);
                }}
            />

            <AreaInput>
                <Input
                    placeholder="Código Postal"
                    keyboradType="numeric"
                    autoCapitalize="true"
                    value={localData.codigoPostal}
                    onChangeText={(t) => setLocalData({...localData, codigoPostal: t})}
                />
            </AreaInput>

            <Button onPress={() => onNext(localData)}>
                <ButtonText>Siguiente</ButtonText>
            </Button>
            <Button style={{backgroundColor: '#666', marginTop: 10}} onPress={onBack}>
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