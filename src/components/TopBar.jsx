import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/drawer';

const TopBar = ({ selectedPet, isLoading }) => {

  const navigation = useNavigation();

  return(
        <View style={styles.container}>
            {/* Lado del logo y nombre de la marca */}
            <View>
                <Image 
                    source={require('../../assets/logos/LogoTipo.png')}
                    style={styles.logoIcon}
                />
            </View>

            {/* Seletor de mascota y notificación */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.petSelector}>
                    {selectedPet?.foto_url ? (
                        <Image
                            source={{ uri: selectedPet.foto_url }}
                            style={styles.petThumb}
                        />
                    
                    ): (
                        <View style={[styles.petThumb, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="paw" size={16} color="#fff" />
                        </View>
                    )}
                    <Text style={styles.petName}>
                        {isLoading ? "Cargando..." : selectedPet?.nombre || "Selecciona tu mascota"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name='notifications-outline' size={24} color="#005d72"/>
                    {/* Badge de notificaciónes para cuando clicar */}
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.menuBtn}
                  onPress={() => navigation.openDrawer()}
                >
                  <Ionicons name="menu-outline" size={26} color="#005d72" />
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Ajuste conforme o entalhe (Notch) do aparelho
    backgroundColor: '#FFF',
    paddingBottom: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 144,
    height: 70,
  },
  brandTextTop: {
    fontSize: 18,
    color: '#F9A825', // Cor amarela do logo
    fontWeight: 300,
    lineHeight: 18,
  },
  brandTextBottom: {
    fontSize: 22,
    color: '#005D71', // Azul escuro
    fontWeight: 600,
    lineHeight: 22,
    marginTop: -5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  petThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  petName: {
    marginHorizontal: 8,
    fontWeight: 600,
    color: '#333',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  }

});

export default TopBar;

// En este componente se muestra la barra superior de la aplicación, con el nombre de la mascota actual o el nombre de la aplicación si no hay una mascota seleccionada. Se utiliza un icono de pata para darle un toque visual relacionado con las mascotas.