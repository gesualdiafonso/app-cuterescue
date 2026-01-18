import styled from "styled-components/native";

export const BackgroundCanvas = styled.ImageBackground`
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
`;

export const Container = styled.KeyboardAvoidingView`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    background-color: transparent;
`;

export const Logo = styled.Image`
    width: 105px;
    height: 155px;
    margin-bottom: 20px;
`;

export const FormArea = styled.View`
    flex-direction: column;
    background-color: rgba(34, 104, 123, 0.4);    
    padding: 20px;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const ContainerScroll = styled.ScrollView`
    flex: 1;
    padding: 0 30px;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
`;

export const FormTitle = styled.Text`
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: bold;
    opacity: 1;
    color: #f5f5f5;
`;

export const AreaInput = styled.View`
    width: 90%;
    margin-bottom: 15px;
`;

export const Input = styled.TextInput`
    background-color: #fff;
    width: 100%;
    padding: 10px;
    border-radius: 15px;
    color: #000;
    font-size: 16px;
`;

export const Label = styled.Text`
    font-size: 16px;
    margin-bottom: 5px;
    color: #d5d5d5;
`;

export const Link = styled.TouchableOpacity`
    width: 90%;
    height: 45px;
    border-radius: 8px;
    background-color: #f7a82a;
    margin-top: 10px;
    align-items: center;
    justify-content: center;
`;

export const LinkText = styled.Text`
    font-size: 20px;
    color: #f5f5f5;
`;

export const Button = styled.TouchableOpacity`
    width: 90%;
    height: 45px;
    border-radius: 8px;
    background-color: #22687b;
    margin-top: 10px;
    align-items: center;
    justify-content: center;
`;

export const ButtonText = styled.Text`
    font-size: 20px;
    color: #f5f5f5;
`;

export const ErrorText = styled.Text``;

