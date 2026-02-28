import { View, Text
 } from "react-native";

 import styled from "styled-components/native";

const StepWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Dot = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${props => props.active ? "#FF8C00" : "#fff"};
  justify-content: center;
  align-items: center;
`;

const Line = styled.View`
  width: 40px;
  height: 2px;
  background-color: #fff;
`;

 export default function StepIndicator({ currentStep }){
    return(
        <StepWrapper>
            <Dot active={currentStep >= 1}>
                <Text styeld={{ color: 'white' }}> 1 </Text>
            </Dot>

            <Line />

            <Dot active={currentStep >= 2}>
                <Text styeld={{ color: 'white' }}> 2 </Text>
            </Dot>

            <Line />

            <Dot active={currentStep >= 3}>
                <Text styeld={{ color: 'white' }}> 3 </Text>
            </Dot>

            <Line />
        </StepWrapper>
    )
 }