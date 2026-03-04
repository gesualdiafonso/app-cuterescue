import React, { useState } from "react";
import { AreaInput, Input, Button, ButtonText } from "../../../styles/forms.styles";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import { Alert, StyleSheet } from "react-native";
import { geocodeAddress } from "../../../services/geoAPI.services";

export default function StepAddress({ data, onNext, onBack }){
    const [localData, setLocalData] = useState(data);
    const [isFocus, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);

    // Datos
    const provincias = [
        { label: 'Capital Federa', value: 'Capital Federal'},
        { label: 'GBA Norte', value: 'GBA Norte'},
        { label: 'GBA Sur', value: 'GBA Sur'},
        { label: 'GBA Oeste', value: 'GBA Oeste'},
        { label: 'Buenos Aires Interior', value: 'Buenos Aires Interior'},
    ]

    const handleNext = async () => {
            if (!localData.direccion || !localData.codigoPostal || !localData.provincia) {
                return Alert.alert("Campos incompletos", "Por favor, completar todos los campos!");
            }
            setLoading(true);
            try {
                // Importe a função geocodeAddress que criamos acima
                const geo = await geocodeAddress(localData.direccion, localData.provincia);

                if (geo.success) {
                    // Se achou as coordenadas, salva no localData e avança
                    onNext({ ...localData, lat: geo.lat, lng: geo.lng });
                } else {
                    Alert.alert(
                        "Dirección no encontrada", 
                        "No pudimos localizar esta dirección. Por favor, verifique el nombre de la calle y numeración."
                    );
                }
            } catch (err) {
                Alert.alert("Error de conexión", "No pudimos validar la dirección. Intente de nuevo.");
            } finally {
                setLoading(false);
            }
            onNext(localData);
        }
    return(
        <>
            <AreaInput>
                <Input
                    placeholder="Dirección"
                    keyboardType="words"
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
                    keyboardType="numeric"
                    autoCapitalize="true"
                    value={localData.codigoPostal}
                    onChangeText={(t) => setLocalData({...localData, codigoPostal: t})}
                />
            </AreaInput>

            <Button onPress={handleNext} disabled={loading}>
                <ButtonText>{loading ? "Validando..." : "Siguiente"}</ButtonText>
            </Button>
            <Button style={{
                    backgroundColor: '#fff', 
                    marginTop: 10,
                    borderColor: '#000',
                    borderWidth: 1,
                    
                    }} 
                    onPress={onBack}>
                <ButtonText style={{ color: '#000'}}>Volver atrás</ButtonText>
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