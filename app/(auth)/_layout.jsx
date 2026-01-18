import { Stack } from "expo-router";
import { AuthProvider } from "../../src/contexts/AuthContext";

export default function AuthLayout(){
    return(
        // <AuthProvider>
        //     <Stack>
        //     <Stack.Screen 
        //             name="login/index"  
        //             options={{ title: "Hacer Login" }}
        //         />
        //         <Stack.Screen 
        //             name="register/index" 
        //             options={{ title: "Registrar", headerBackTitle: "Volver" }}
        //         />
        //     </Stack>
        // </AuthProvider>
        <Stack>
            <Stack.Screen 
                    name="login/index"  
                    options={{ title: "Hacer Login" }}
                />
                 <Stack.Screen 
                    name="register/index" 
                    options={{ title: "Registrar", headerBackTitle: "Volver" }}
                />
        </Stack>
    )
}