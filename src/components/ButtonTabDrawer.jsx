import { useNavigation } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/drawer';

export default function ButtonTabDrawer() {
    const navigation = useNavigation();

    return(
        <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ padding: 10 }}
        >
            <Ionicons name="menu-outline" size={26} color="#005d72" />
        </TouchableOpacity>
    )
}