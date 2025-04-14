import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';

interface BottomNavProps {
    navigation: StackNavigationProp<RootStackParamList>;
    role: string | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ navigation, role }) => {
    return (
        <View style={styles.bottomNav}>
            {role === 'OWNER' || role === 'ADMINISTRADOR' ? (
                <>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Agregar Eventos" onPress={() => navigation.navigate('CreateEvent')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="plus-circle" size={30} color="white" />
                                <Text style={styles.iconText}>AGREGAR</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Inicio" onPress={() => navigation.navigate('Home')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="home" size={30} color="white" />
                                <Text style={styles.iconText}>INICIO</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {role === 'ADMINISTRADOR' || role === 'OWNER' ? (
                        <View style={styles.iconContainer}>
                            <TouchableOpacity accessibilityLabel="Admin Panel" onPress={() => navigation.navigate('AdminPanel')}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesome name="dashboard" size={30} color="white" />
                                    <Text style={styles.iconText}>ADMIN</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </>
            ) : role === 'ORGANIZADOR' ? (
                <>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Crear Evento" onPress={() => navigation.navigate('CreateEvent')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="plus-circle" size={30} color="white" />
                                <Text style={styles.iconText}>CREAR</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Inicio" onPress={() => navigation.navigate('Home')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="home" size={30} color="white" />
                                <Text style={styles.iconText}>INICIO</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Mis Eventos" onPress={() => alert('Mis Eventos')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="calendar" size={30} color="white" />
                                <Text style={styles.iconText}>MIS EVENTOS</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Admin Panel" onPress={() => navigation.navigate('AdminPanel')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="dashboard" size={30} color="white" />
                                <Text style={styles.iconText}>ADMIN</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Eventos" onPress={() => navigation.navigate('BoughtTickets')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="calendar" size={30} color="white" />
                                <Text style={styles.iconText}>EVENTOS</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Favoritos" onPress={() => navigation.navigate('Favorites')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="star" size={30} color="white" />
                                <Text style={styles.iconText}>FAVORITOS</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Inicio" onPress={() => navigation.navigate('Home')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="home" size={32} color="white" />
                                <Text style={styles.iconText}>INICIO</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Carrito" onPress={() => navigation.navigate('ShoppingCart')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="shopping-cart" size={30} color="white" />
                                <Text style={styles.iconText}>CARRITO</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity accessibilityLabel="Perfil" onPress={() => navigation.navigate('Profile')}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="user" size={30} color="white" />
                                <Text style={styles.iconText}>PERFIL</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '100%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        alignItems: 'center',
    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },
});

export default BottomNav;
