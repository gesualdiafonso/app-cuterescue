import { View, Text, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";

import { ContainerScroll, FormTitle, AreaInput, Input, Label, Link, LinkText, Button, ButtonText, FormArea, BackgroundCanvas, } from "../../../src/styles/forms.styles";

export default function Register(){

    const router = useRouter();
    return(
        <BackgroundCanvas 
            source={require('../../../assets/images/background_cuterescue.png')}
            resizeMode="cover"
            opacity={0.4}
        >

            <ContainerScroll>
                <FormArea>

                    <FormTitle>Crear una nueva cuenta</FormTitle>

                    <AreaInput>
                        <Input
                            placeholder="Primero y Segundo nombre"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Apellido "
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Fecha de nacimiento"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Tipo de Documento"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Numero de documento"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Teléfono"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Correo Electronico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Contraseña"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Confirmar Contraseña"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Dirección"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Provincia"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <AreaInput>
                        <Input
                            placeholder="Código Postal"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </AreaInput>

                    <Button>
                        <ButtonText>Registrar</ButtonText>
                    </Button>

                    <Link onPress={() => router.replace('/(auth)/login/')}>
                        <LinkText>Iniciar Seción</LinkText>
                    </Link>
                </FormArea>
            </ContainerScroll>
        </BackgroundCanvas>
    )
}