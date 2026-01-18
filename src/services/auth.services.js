import { supabase } from "./Supabase";

export const authService = {
    async login(email, password){
        const { data, error } = await supabase.auth.signInWithPassword({
            email, 
            password
        })
        if (error) throw error;
        return data;
    },

    async signUp(email, password, userData){
        // 1. Auth SingUp
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        }) 
        if (authData) {
            console.log("Este usuario email ya está registrado!")
        }
        if (authError) {
            console.log("Erro al registrar usuario", authError);
            throw authError;
        }

        const userId = authData.user.id;

        // 2. Insert perfil en la tabal de usuarios
        const { error: profileError } = await supabase
            .from('usuarios')
            .insert([
                {
                    id: userId,
                    email,
                    password,
                    ...userData
                }
            ]);
        
        if (profileError) throw profileError;

        return authData;
    },

    async logout(){
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser(){
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },
}