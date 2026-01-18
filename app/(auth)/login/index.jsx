import React, { useState } from "react";
import { Alert } from "react-native";

import { useRouter } from "expo-router";
import { Platform } from "react-native";

import { BackgroundCanvas, Container, FormTitle, Input, Label, Link, LinkText, Button, ButtonText, FormArea, AreaInput, Logo } from "../../../src/styles/forms.styles";
import { useAuth } from "../../../src/contexts/AuthContext";

const ImageSource = require('../../../assets/images/background_cuterescue.png');

export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        try{
            await login(email, password);

        } catch (error) {
            Alert.alert("Erro al ingresar", error.message);
        }
    }
    
    return(
       <BackgroundCanvas
            source={ImageSource}
            resizeMode="cover"
            opacity={0.4}
        >
         <Container
                // se estiver no ios, empurra o conteudo pra cima
                behavior={Platform.OS === "ios" ? "padding" : ""}
                enabled
            >

                <FormArea>
                    <Logo 
                        source={require('../../../assets/logos/LogoColor.png')}
                    />
                    <FormTitle>Accedé a tu cuenta</FormTitle>

                    <AreaInput>
                        <Label>Correo Electronico</Label>
                        <Input
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Label>Contraseña</Label>
                        <Input
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </AreaInput>

                    <Button onPress={handleLogin}>
                        <ButtonText>Ingresar</ButtonText>
                    </Button>

                    <Link onPress={() => router.push('/(auth)/register')}>
                        <LinkText>Registrar</LinkText>
                    </Link>

                </FormArea>

            </Container>

       </BackgroundCanvas>
    )
}