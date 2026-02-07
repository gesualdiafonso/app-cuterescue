import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { SavedDataProvider } from "../src/contexts/SaveDataContext";
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useThemeStatus } from "../src/contexts/ThemeContext";
import ModalAlert from "../src/components/ui/modals/ModalAlert";

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
    const { status, isRouteAllower } = useThemeStatus();

    // Estado para controlar el modal de block
    const [showRestrictedModal, setShowRestrictedModal] = useState(false);

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

        // interceptor de emergencia
        if (status === "emergency") {
            // Cambiamos el segmiento de string de path para valida
            const currentPath = `/(tabs)/${segments[1]}`;

            if (!isRouteAllower(currentPath)) {
                // si la rota no ha sido permitida 
                setShowRestrictedModal(true);
                // forzamos a volver
                router.push("/(tabs)/track")
            }
        }
    }, [user, loading, segments, status]);

    return (
        // headerShown: false esconde a barra de título superior do grupo principal
        <Stack screenOptions={{headerShown: false}}>
            {/* Antes de hecho login, inicializa la app con el grupo auth (grupo) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }}/>

            {/* Despues de hecho login, inicializa la app con el grupo tab (grupo) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>

            <ModalAlert
                visible={showRestrictedModal}
                onClose={() => setShowRestrictedModal(false)}
                title="Acción Restringida!"
                message="Tu mascota está en estado de alerta, no se puede navegar por otro lado mientras la Aplicación esté en emergencia!"
                advertense="La actualización del movimiento de la mascota se completará en un tiempo estimado de 20 minutos"
                btnText="Volver al Mapa"
            />
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
                <ThemeProvider>
                    <RootLayoutNav />
                </ThemeProvider>
            </SavedDataProvider>
        </AuthProvider>
    )
}