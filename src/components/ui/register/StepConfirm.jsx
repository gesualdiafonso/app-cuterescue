/**
 * Steps de confirmaçao, onde mostramos todos os dados carregado
 * para que o usuario saiba se está certo ou não.
 * Onde confirmaos
 */

import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, ButtonText } from "../../../styles/forms.styles";
import styled from "styled-components/native";

const InfoBox = styled.View`
    background-color: rgba(255, 255, 255, 0.8);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
`;

const InfoText = styled.Text`
    font-size: 14px;
    color: "#333";
    margin-bottom: 5px;
`;

const Label = styled.Text`
    font-weight: 800;
`;

export default function StepConfirm({ data, onConfirm, onBack }){
    return(
        <ScrollView>

            <InfoBox>
                <InfoText><Label>Nome:</Label> {data.nombre} {data.apellido}</InfoText>
                <InfoText><Label>Email:</Label> {data.email}</InfoText>
                <InfoText><Label>Teléfono:</Label> {data.telefono}</InfoText>
                <InfoText><Label>Nacimiento:</Label> {data.fechaNacimiento}</InfoText>
                <InfoText><Label>Género:</Label> {data.genero}</InfoText>
                <InfoText><Label>Documento:</Label> ({data.tipoDocumento}) {data.documento}</InfoText>
                <InfoText><Label>Dirección:</Label> {data.direccion}</InfoText>
                <InfoText><Label>Provincia:</Label> {data.provincia}</InfoText>
                <InfoText><Label>CP:</Label> {data.codigoPostal}</InfoText>
            </InfoBox>

            <Button onPress={onConfirm}>
                <ButtonText>Confirmar y Registrar</ButtonText>
            </Button>
            <Button style={{backgroundColor: '#666', marginTop: 10}} onPress={onBack}>
                <ButtonText>Corregir Datos</ButtonText>
            </Button>
        </ScrollView>
    )
}