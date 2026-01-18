import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { SavedDataProvider } from "../src/contexts/SaveDataContext";
import * as Notifications from 'expo-notifications';

// Configuramos las notificaciones para que se muestren cuando la app está en foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

function RootLayoutNav(){
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Verificamos si el usuario está intentando acceder a una rota de autenticación
        const inAuthGroup = segments[0] === "(auth)";

        if (!user && !inAuthGroup){
            // Si el usuario no está logado, y no estas en la pagina de auth, enviamos a login
            router.replace("/(auth)/login");
        } else if (user && inAuthGroup) {
            // Si está logado y intentó ir para el login/registar, mandando para el dashboard
            router.replace("/(tabs)/dashboard");
        }
    }, [user, loading, segments]);

    return (
        // headerShown: false esconde a barra de título superior do grupo principal
        <Stack screenOptions={{headerShown: false}}>
            {/* Antes de hecho login, inicializa la app con el grupo auth (grupo) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }}/>

            {/* Despues de hecho login, inicializa la app con el grupo tab (grupo) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        </Stack>
    )
}

// Está es la rota principal de la aplicación
// donde vamos enviar estados, contextos globales, etc.
// substituyendo al App.js tradicional de React Native
export default function Layout(){
    return(
        // // headerShown: false esconde a barra de título superior do grupo principal
        // <Stack screenOptions={{headerShown: false}}>
        //     {/* Antes de hecho login, inicializa la app con el grupo auth (grupo) */}
        //     <Stack.Screen name="(auth)" />

        //     {/* Despues de hecho login, inicializa la app con el grupo tab (grupo) */}
        //     <Stack.Screen name="(tabs)" />
        // </Stack>
        <AuthProvider>
            <SavedDataProvider>
                <RootLayoutNav />
            </SavedDataProvider>
        </AuthProvider>
    )
}