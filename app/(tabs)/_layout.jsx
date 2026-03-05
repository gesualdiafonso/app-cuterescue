import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import TopBar from "../../src/components/TopBar";
import usePetManager from "../../src/hooks/usePetManager";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/drawer";
import ButtonTabDrawer from "../../src/components/ButtonTabDrawer";


export default function ViewLayout() {

    const { selectedPet, loading } = usePetManager();

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <TopBar selectedPet={selectedPet} isLoading={loading} />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#FF8C09",
                    tabBarInactiveTintColor: "#22687B"
                }}
            >
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: 'Inicio',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="track"
                    options={{
                        title: 'Ubicame',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="location" size={size} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="vet24hr"
                    options={{
                        title: 'Vet 24hrs',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="medkit" size={size} color={color} />
                        )
                    }}
                />
                
                <Tabs.Screen
                    name="more" // Corresponde à pasta app/(tabs)/more
                    options={{
                        title: 'Más',
                        tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />
                    }}
                />
            </Tabs>
        </View>
    );
}