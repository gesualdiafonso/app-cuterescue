import CardPet from "./ui/CardPet"
import AddCard from "./ui/AddCard"
import { ScrollView, View } from "react-native"

export default function Pets({ pets, onSuccess }) {

    return(
        <View>
            {pets && pets.map((pet) => (
                <CardPet key={pet.id} pet={pet} onSuccess={onSuccess}/>
            ))}
            <AddCard onSuccess={onSuccess} />
        </View>
    )
}