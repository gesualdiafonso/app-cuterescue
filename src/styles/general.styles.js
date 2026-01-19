import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
`;

export const Logo = styled.Image`
    width: 105px;
    height: 155px;
    margin-bottom: 20px;
`;

export const ImageRoundedAvatar = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 1px solid #3D8E88;
    margin: 0 auto;
`;

export const Link = styled.Button`
    font-size: 16px;
    color: gray;
`;

export const LinkText = styled.Text``;


export const TextH1 = styled.Text`
    font-size: 28px;
    font-weight: bold;
    text-align: center;
`;

export const TextH2 = styled.Text`
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 10px;
`;

export const LineBottom = styled.View`
    width: 100%;
    height: 2px;
    background-color: gray;
    margin: 10px;
`;

export const TextH3 = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

export const Paragraph = styled.Text`
    font-size: 14px;
    font-weight: light;
    color: white;
`;

export const Stronger = styled.Text``;

export const Card = styled.View`
    background-color: #3D8E88;
    border-radius: 15px;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

export const CardImage = styled.View`
    width: 40%;
    background-color: black;
    border-radius: 15px;
`;

export const ImageCard = styled.Image`
    width: 100%;
    height: 150px;
    border-radius: 10px;
    margin: 0 auto;
`;

export const CardBody = styled.View`
    width: 60%;
    color: white;
    border-radius: 15px;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
`;

export const CardAdd = styled.View`
    background-color: #3D8E88;
    border-radius: 15px;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 20px;
    margin: 10px auto;
`;

export const SelectContainer = styled.View`
    width: 90%;
    height: 55px;
    background-color: #f0f0f0;
    border-radius: 12px;
    border-width: 1px;
    border-color: #22678d;
    margin: 10px auto;
    justify-content: center;
`;

export const StyledPickerLabel = styled.Text`
    font-size: 14px;
    color: #22678d;
    font-weight: bold;
    margin-left: 20px;
    margin-top: 10px;
`;

export const DocCard = styled.View`
    width: 100%;
    background-color: #1f2937;
    border-radius: 20px;
    padding: 20px;
    margin-top: 15px;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
`;

export const CardHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
`;

export const LabelText = styled.Text`
    width: 100%;
    color: #ffff;
    font-size: 14px;
    font-weight: bold;
`;

export const ValueText = styled.Text`
    color: #d1d5db;
    font-size: 12px;
    font-weight: bold;
`;

export const Badge = styled.View`
    background-color: ${props => props.status === 'Activo' ? '#4ade80' : '#f97316'};
    padding: 4px 12px;
    border-radius: 8px;
`;

export const BadgeText = styled.Text`
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
`;

export const InfoButton = styled.TouchableOpacity`
    background-color: #164e63;
    padding: 10px;
    border-radius: 10px;
    align-self: flex-end;
    margin-top: 5px;
`;

export const AddCard = styled.TouchableOpacity`
    background-color: #ffcc91;
    border-radius: 20px;
    height: 120px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;