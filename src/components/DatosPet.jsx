import React, {} from "react";
import { View, Text } from "react-native";
import { Paragraph, Stronger } from "../styles/general.styles";

export default function DatosPet ({ pet }) {
    if (!pet) return null;

    return(
        <View>
            <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Informaciones de la mascota</Text>
            <Paragraph style={{ color: 'black' }}><Stronger>Nombre: </Stronger>{pet.nombre}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Raza: </Stronger>{pet.raza}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Especie: </Stronger>{pet.especie}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Color: </Stronger>{pet.color}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Sexo: </Stronger>{pet.sexo}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Peso: </Stronger>{pet.peso}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Fecha de Nacimiento: </Stronger>{pet.fecha_nacimiento}</Paragraph>
            <Paragraph style={{ color: 'black' }}><Stronger>Estado de salud: </Stronger>{pet.estado_salud}</Paragraph>
            <Paragraph style={{ color: 'black' }}>
                <Stronger>Ultima ubicación:</Stronger> {"\n"}
                {pet.localizacion?.direccion || "Ubicación no disponible"}
            </Paragraph>
        </View>
    )
}