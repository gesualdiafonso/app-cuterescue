
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image} from "react-native"
import { useAuth } from "../../../src/contexts/AuthContext"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { ImageRoundedAvatar } from "../../../src/styles/general.styles";
import { userService } from "../../../src/services/user.services";
import { useEffect, useState } from "react";

export default function More(){
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const loadProfile = async () => {
         try {
            setLoading(true);
            const data = await userService.fetchProfile(user.id);
            setProfile(data);
        } catch (error) {
            Alert.alert("Erro al cargar las información de perfil!")
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    const menuItems = [
        { id: 'profile', label: 'Mi Perfil', icon: 'person-outline', navigateTo: '/more/profile' },
        { id: 'plan', label: 'Plan de Rescate', icon: 'document-text-outline', navigateTo: '/more/viewplan' },
        { id: 'report', label: 'Informe de Mascote', icon: 'paw-outline', navigateTo: '/more/informpet' },
        { id: 'documentation', label: 'Documentación', icon: 'folder-open-outline', navigateTo: '/more/docvet' },
        { id: 'events', label: 'Eventos', icon: 'calendar-outline', navigateTo: '/more/events' },
    ]

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sessión",
            "¿Estas seguro de que quieres salir?",
            [
                {text: "Cancelar", style: "cancel"},
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: async () => await logout()
                }
            ]
        );
    }

    useEffect(() => {
        loadProfile();
    }, [])

    return(
        <ScrollView contentContainerStyle={styles.container} >
            <View style={{
                width: 150, 
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 75,
                marginTop: 30,
                alignSelf: 'center'
            }}>
                <ImageRoundedAvatar src={profile?.foto_url} alt={profile?.nombre + " " + profile?.apellido} />
            </View>
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#22687B' }}>Hola! {profile?.nombre}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>{profile?.email}</Text>
            </View>
            
            {/* Botoes de navegacoes para Mi perfil, plan, informe mascote, documentación, eventos y botton de logout */}
        
            <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItems}
                        onPress={() => router.push(item.navigateTo)}
                    >
                        <View style={styles.menu}>
                            <Ionicons name={item.icon} size={24} color="#22687B" style={{ marginRight: 10 }} />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FBC68F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    logo: { width: 30, height: 30 },
    userInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#22687B' },
    logoutLink: { color: '#7E3AF2', fontWeight: 'bold', marginTop: 4 },
    menuContainer: { paddingHorizontal: 15 },
    menuItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F8F8'
    },
    menu: { flexDirection: 'row', alignItems: 'center' },
    menuLabel: { marginLeft: 15, fontSize: 16, color: '#333', fontWeight: '500' }
});