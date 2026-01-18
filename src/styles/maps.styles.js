import styled from "styled-components";
import MapView from "react-native-maps";

export const MapContainer = styled.View`
    width: 100%;
    height: 250px;
    border-radius: 30px;
    overflow: hidden;
    margin-vertical: 15px;
    border-width: 1px;
`;

export const BaseMap = styled(MapView)`
    width: 100%;
    height: 100%;
`