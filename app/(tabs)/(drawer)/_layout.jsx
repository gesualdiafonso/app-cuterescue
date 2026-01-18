import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import { Drawer } from "expo-router/drawer"
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer"
import { useAuth } from "../../../src/contexts/AuthContext"
import { Alert, View, Text, Image} from "react-native";

//const Drawer = createDrawerNavigator();

// Componente customizado para el menu lateral
function CustomDrawerContent(props){
    const { logout, user } = useAuth();

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
    };

    return(
        <DrawerContentScrollView {...props}>

            <View style={{
                flex: 1,
                margin: 0,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image style={{}} source={require('../../../assets/logos/LogoTipo.png')} />
            </View>

           <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#22687B' }}>Hola! {user?.nombre}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>{user?.email}</Text>
            </View>

            <DrawerItemList {...props} />

            <DrawerItem 
                label="Cerrar Sesión"
                onPress={handleLogout}
                labelStyle={{color: '#ff8C09', fontWeight: 'bold'}}
                icon={({color, size}) => (
                    <Ionicons name="log-out-outline" size={size} color={color} />
                )}
            />

        </DrawerContentScrollView>
    )
}

export default function DrawerLayout(){
    return(
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerActiveTintColor: "white",
                drawerInactiveTintColor: "#22687b",
                drawerActiveBackgroundColor: "#FBC68F",
                drawerStyle: {
                    backgroundColor: "#F0F9F8",
                    justifyContent: 'center',
                    width: 280, 
                    zIndex: 100,
                    elevation: 10
                },
                drawerLabelStyle: {
                    fontWeight: 'bold',
                    fontSize: 14, 
                },
                overlayColor: 'rgba(1, 1, 1, 0.6)'
            }}
        >
            <Drawer.Screen
                name="index"
                options={
                    {
                        title: 'Mi perfil',
                        drawerLabel: 'Mi perfil',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="person-outline" size={size} color={color} />
                        )
                    }
                } />
            
            <Drawer.Screen
                name="viewplan"
                options={
                    {
                        title: 'Visualizar Plan',
                        drawerLabel: 'Visualizar plan',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="card-outline" size={size} color={color} />
                        )
                    }
                }
            />

            <Drawer.Screen
                name="informpet"
                options={{
                    title: 'Información Mascotas',
                    drawerLabel: 'Informe Mascotas',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="paw-outline" size={size} color={color} />
                        )
                }}
                />
            
            <Drawer.Screen
                name="docvet"
                options={{
                    title: 'Documentación Veterinarias',
                    drawerLabel: 'Documentación',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="document-attach-outline" size={size} color={color} />
                        )
                }}
            />

            <Drawer.Screen
                name="events"
                options={{
                    title: 'Eventos',
                    drawerLabel: 'Eventos',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="calendar-outline" size={size} color={color} />
                        )
                }}
            />
        </Drawer>
    )
}