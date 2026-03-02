import { View, Text, TouchableOpacity, Alert } from "react-native";

import { useRouter } from "expo-router";

import { ContainerScroll, FormTitle, AreaInput, Input, Label, Link, LinkText, Button, ButtonText, FormArea, BackgroundCanvas, } from "../../../src/styles/forms.styles";
import StepAccount from "../../../src/components/ui/register/StepsAccount";
import StepPersonal from "../../../src/components/ui/register/StepPersonal";
import StepAddress from "../../../src/components/ui/register/StepsAddress";
import StepConfirm from "../../../src/components/ui/register/StepConfirm";
import { useState } from "react";
import StepIndicator from "../../../src/components/ui/register/StepIndicator";

import { authService } from "../../../src/services/auth.services";

export default function Register(){

    const router = useRouter();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '',
        nombre: '', apellido: '', telefono: '', fechaNacimiento: '', 
        genero: '', tipoDocumento: 'DNI', documento: '',
        direccion: '', provincia: '', codigoPostal: ''
    });

    const formatToInsert = (dateStr) => {
        if (!dateStr) return null;
        // Converte "23/04/1994" -> ["23", "04", "1994"] -> "1994-04-23"
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleNext = (stepData) => {
        setFormData({...formData, ...stepData});
        setStep(step + 1);
    }

    const handleBack = () => setStep(step - 1);
    
    const handleFinalSubmit = async () => {
        try {

            const { confirmPassword, password, ...profileData } = formData;
            // Chamada ao seu serviço de Supabase
            const dataParaEnvfio ={
                ...profileData,
                fechaNacimiento: formatToInsert(formData.fechaNacimiento)
            }
            await authService.signUp(formData.email, formData.password, dataParaEnvfio);
            Alert.alert("Écito", "¡Cuenta ha sido creada con éxito!")
            router.replace('/(auth)/login/');
        } catch (error) {
            console.error("Erro no registro:", error);
            alert("Error: " + error.message);
        }
    }

    return(
        <BackgroundCanvas 
            source={require('../../../assets/images/background_cuterescue.png')}
            resizeMode="cover"
            opacity={0.4}
        >

            <ContainerScroll>

                <FormArea>

                    <FormTitle>Crear una nueva cuenta</FormTitle>
                    <StepIndicator currentStep={step} />

                    {step === 1 && <StepAccount data={formData} onNext={handleNext} />}
                    {step === 2 && <StepPersonal data={formData} onNext={handleNext} onBack={handleBack} />}
                    {step === 3 && <StepAddress data={formData} onNext={handleNext} onBack={handleBack} />}
                    {step === 4 && <StepConfirm data={formData} onConfirm={handleFinalSubmit} onBack={handleBack} />}

                    <Link onPress={() => router.replace('/(auth)/login/')}>
                        <LinkText>Ya tengo cuenta.</LinkText>
                    </Link>

                </FormArea>

            </ContainerScroll>

        </BackgroundCanvas>
    )
}