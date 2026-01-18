import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ViewLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#FF8C09",
                tabBarInactiveTintColor: "#22687B"
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="track"
                options={{
                    title: 'Rastreamento',
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
                name="(drawer)"
                options={{
                    title: 'Mi Perfil',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}