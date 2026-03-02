import React, { useState } from "react";
import { AreaInput, Input, Button, ButtonText } from "../../../styles/forms.styles";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import { Alert, StyleSheet } from "react-native";

export default function StepPersonal({ data, onNext, onBack }){
    const [localData, setLocalData] = useState(data);
    const [isFocus, setIsFocus] = useState(false);
    const [isFocusGender, setIsFocusGender] = useState(false);

    // Datos
    const docTypes =[
        { label: 'DNI', value: 'DNI' },
        { label: 'Pasaporte', value: 'PASAPORTE' },
        { label: 'CUIL', value: 'CUIL' },
    ];

    const genderTypes = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
        { label: 'Otro', value: 'Otro' },
    ];

    const handleNext = () => {
        const { nombre, apellido, documento, telefono, fechaNacimiento, genero } = localData;
        
        if (!nombre || !apellido || !documento || !telefono || !fechaNacimiento || !genero) {
            return Alert.alert("Campos incompletos", "Por favor, completa todos los campos personales.");
        }
        
        // Validação simples de formato de data (DD/MM/AAAA)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(fechaNacimiento)) {
            return Alert.alert("Fecha inválida", "Usa o formato DD/MM/AAAA");
        }

        onNext(localData);
    }

    // Função para aplicar máscara de data automaticamente
    const handleDateChange = (text) => {
        let cleanText = text.replace(/\D/g, ""); // Remove o que não é número
        let formatted = cleanText;
        if (cleanText.length > 2) formatted = `${cleanText.slice(0, 2)}/${cleanText.slice(2)}`;
        if (cleanText.length > 4) formatted = `${formatted.slice(0, 5)}/${cleanText.slice(4, 8)}`;
        setLocalData({...localData, fechaNacimiento: formatted});
    };

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

            <AreaInput>
                <Input 
                    placeholder="Teléfono (ej: +54...)"
                    keyboardType="phone-pad"
                    value={localData.telefono}
                    onChangeText={(t) => setLocalData({...localData, telefono: t})}
                />
            </AreaInput>

            <AreaInput>
                <Input 
                    placeholder="Edad (DD/MM/AAAA)"
                    keyboardType="numeric"
                    maxLength={10}
                    value={localData.fechaNacimiento}
                    onChangeText={handleDateChange}
                />
            </AreaInput>

            <Dropdown
                style={[styles.dropdown, isFocusGender && { borderColor: '#FF8C00' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={genderTypes}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocusGender ? 'Género' : '...'}
                value={localData.genero}
                onFocus={() => setIsFocusGender(true)}
                onBlur={() => setIsFocusGender(false)}
                onChange={item => {
                    setLocalData({...localData, genero: item.value});
                    setIsFocusGender(false);
                }}
            />

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