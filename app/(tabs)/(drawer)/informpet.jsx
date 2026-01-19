// Pagina de información de mascotas
import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, ActivityIndicator } from "react-native"
import { Picker } from "@react-native-picker/picker";
import DropdownSelect from "../../../src/components/ui/DropdownSelect";
import usePetManager from "../../../src/hooks/usePetManager"
import Pets from "../../../src/components/Pets";
import DatosPet from "../../../src/components/DatosPet";
import { 
    ImageRoundedAvatar, 
    LineBottom, Paragraph, 
    TextH2, TextH3, SelectContainer,
    StyledPickerLabel,
    Container
} from "../../../src/styles/general.styles";

export default function InformPet(){
    const { pets, loading, selectedPet, setSelectedPet, refreshPets } = usePetManager();

    // Función de calcular idade
    const countBirthday = (fechaNacimiento) => {
        if (!fechaNacimiento) return "Edad desconocida";
        const today = new Date();
        const birthDate = new Date(fechaNacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age >= 0 ? age : 0} años`;
    }

    useEffect(() => {
        if (pets && pets.length > 0 && !selectedPet) {
            setSelectedPet(pets[0]);
        }
    }, [pets]);

    console.log("Pets carregados:", pets.length);
    
    if (loading) return <ActivityIndicator size="large" color="#22678d" style={{ flex: 1 }} />;

    return(
        <ScrollView>
            <Container>
                <TextH2 style={{ textAlign: 'end', color: "#22678d"}}>Perfil de Mascota</TextH2>
                {/* Especie de filtrado por mascotas, una vez seleccionado va cambiar el componentente informPet */}
                {/* Deve vir um tipo label de select para selecionar la mascota que deseas ver o un card que desplaze lateral */}
                
                <StyledPickerLabel>Seleccionar Mascota:</StyledPickerLabel>
                <SelectContainer>
                    <DropdownSelect pets={pets} />
                </SelectContainer>
                {selectedPet ? (
                    <View>
                        <View>
                            <ImageRoundedAvatar src={selectedPet.foto_url} alt={selectedPet.nombre} style={{ height: 150, width: 150 }} />
                            <TextH3>{selectedPet.nombre}</TextH3>
                            <Paragraph style={{ color: 'black', fontWeight: 'bold' }}>
                                {selectedPet.especie} • {countBirthday(selectedPet.fecha_nacimiento)}
                            </Paragraph>
                        </View>
                        {/* Componente de información pet */}
                        <LineBottom />
                        <View>
                            <DatosPet pet={selectedPet} />
                        </View>
                    </View>
                ) : (
                    <Paragraph> No tiene mascotas registradas!</Paragraph>
                )}

            </Container>
        </ScrollView>
    )
}