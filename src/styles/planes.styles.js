import styled from "styled-components/native";

export const Container = styled.ScrollView.attrs({
    contentContainerStyle: {
        alignItem: 'center',
        paddingVertical: 20,
    }
})`
    flex: 1;
    background-color: #f9f9f9;
    `;

export const PlansWrapper = styled.View`
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 0 20px;
`;

export const PlanCard = styled.View`
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    border-width: ${props => (props.highlighted ? '2px' : '1px'   )};
    border-color: ${props => (props.themeColor || "#3D8E88" )};
    elevation: 4;
    shadow-color: "#000";
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
`;

export const PlanTitle = styled.Text`
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${props => props.textColor || '#3D8E88'};
`;

export const PriceLabel = styled.Text`
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 20px;
    color: #333;
`;

export const BenefitItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

export const PlanButton = styled.TouchableOpacity`
    background-color: ${props => props.isHighlighted ? '#F7A82A' : '#22687B' };
    padding: 12px;
    border-radius: 8px;
    align-items: center;
    margin-top: 10px;
`;

export const ButtonText = styled.Text`
    color: #fff;
    font-weight: 800;
    font-size: 16px;
`;



