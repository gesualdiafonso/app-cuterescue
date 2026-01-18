// app/index.jsx
// Criado para hacer un redirecionamento automático a la pantalla de login
import { Redirect } from "expo-router";

export default function Index() {
    // Redirigir automáticamente a la pantalla de login
    return <Redirect href="/(auth)/login" />;
}