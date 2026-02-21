import { Stack } from "expo-router";

export default function MoreLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* O index é a sua lista de botões */}
            <Stack.Screen name="index" options={{ headerShown: false}} />
            {/* Configuração individual para as sub-telas */}
            <Stack.Screen 
                name="profile" 
                options={{ title: 'Mi Perfil' }} 
            />
            <Stack.Screen 
                name="viewplan" 
                options={{ title: 'Plan de Rescate' }} 
            />
            <Stack.Screen 
                name="informpet" 
                options={{ title: 'Informe de Mascote' }} 
            />
            <Stack.Screen 
                name="docvet" 
                options={{ title: 'Documentación' }} 
            />
            <Stack.Screen 
                name="events" 
                options={{ title: 'Eventos' }} 
            />
        </Stack>
    );
}