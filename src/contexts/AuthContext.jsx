import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/Supabase";
import { authService } from "../services/auth.services";

import { useNavigation } from "expo-router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        // Chequeamos si la sesión está activa cuando abre la app
        supabase.auth.getSession().then(( { data: { session } } ) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // escuchamos cambios (login y logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        })

        return () => authListener.subscription.unsubscribe();
    }, []);
    
    const login = async (email, password) => {
        return await authService.login(email, password);
    }

    const logout = async () => {
        await authService.logout();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                userId: user?.id,
                loading,
                login,
                logout   
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);