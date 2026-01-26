import { TouchableOpacity } from "react-native";
import { useSavedData } from "../../contexts/SaveDataContext";
import { Card, CardBody, CardImage, ImageCard, TextH3, Paragraph, Stronger } from "../../styles/general.styles";

export default function CardPet({ pet }){
    const { selectedPet, setSelectedPet } = useSavedData();

    // verificamos si este pe es lo que está siendo selecionado globalmente
    const isSelected = selectedPet?.id === pet.id;

    const handlePress = () => {
        setSelectedPet(pet);
    }

    return(
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Card 
                style={{
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: "#71dd5b",
                    marginRight: 15,
                    marginTop: 10
                }}
            >
                <CardImage>
                    <ImageCard src={pet?.foto_url} alt={pet?.nombre} />
                </CardImage>
                <CardBody style={{ alignItems: 'flex-self'}}>
                    <TextH3>{pet.nombre}</TextH3>
                    <Paragraph><Stronger>Especie: </Stronger>{pet.especie}</Paragraph>
                    <Paragraph><Stronger>Color: </Stronger>{pet.color}</Paragraph>
                    <Paragraph><Stronger>Sexo: </Stronger>{pet.sexo}</Paragraph>
                    
                    <Paragraph style={{ marginTop: 5, color: '#22687b' }}>
                        {pet.localizacion?.direccion || 'Sin ubicación'}
                    </Paragraph>
                </CardBody>
            </Card>
        </TouchableOpacity>
    )
}