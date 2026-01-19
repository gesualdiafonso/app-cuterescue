import CardPet from "./ui/CardPet"
import AddCard from "./ui/AddCard"
import { ScrollView } from "react-native"

export default function Pets({ pets }) {

    return(
        <ScrollView>
            {pets && pets.map((pet) => (
                <CardPet key={pet.id} pet={pet} />
            ))}
            <AddCard />
        </ScrollView>
    )
}