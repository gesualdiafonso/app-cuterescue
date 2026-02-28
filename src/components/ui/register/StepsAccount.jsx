import React, { useState } from "react";
import { AreaInput, Input, Button, ButtonText  } from "../../../styles/forms.styles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";


export default function StepAccount({ data, onNext }) {
    const [localData, setLocalData] = useState({
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.confirmPassword || ""
    });
    const [showPass, setShowPass] = useState(false);

    const handleNext = () => {
        if (!localData.email.includes("@")) return Alert.alert("Erro", "Email inválido");
        if (localData.password.length < 6) return Alert.alert("Erro", "Senha muito curta");
        if (localData.password !== localData.confirmPassword) return Alert.alert("Erro", "As senhas não coincidem");
        onNext(localData);
    };

    return (
        <>
            <AreaInput>
                <Input 
                    placeholder="Email"
                    value={localData.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(t) => setLocalData({...localData, email: t})}
                />
            </AreaInput>

            <AreaInput>
                <Input
                    placeholder="Contraseña"
                    secureTextEntry={!showPass}
                    style={{ flex: 1 }}
                    keyboardType="password"
                    autoCapitalize="none"
                    value={localData.password}
                    onChangeText={(t) => setLocalData({...localData, password: t})}
                />

                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Ionicons name={showPass ? "eye-off" : "eye"} size={24} color="#fff" />
                </TouchableOpacity>
            </AreaInput>

            {/* Campo para validar se a senha superio é verdadeira */}
            <AreaInput>
                <Input
                    placeholder="Confirmar Contraseña"
                    secureTextEntry={!showPass}
                    value={localData.confirmPassword}
                    onChangeText={(t) => setLocalData({...localData, confirmPassword: t})}
                />
            </AreaInput>

            <Button onPress={handleNext}>
                <ButtonText>Siguiente</ButtonText>
            </Button>
        </>
    )
}
