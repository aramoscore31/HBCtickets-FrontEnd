import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../app/index';
import { styles } from '../css/ProfileSyles';
import BottomNav from '../components/BottomNav';
import URL_BACK from '../config/urlBack';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRecommendationBar, setShowRecommendationBar] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
            } else {
                getUserData(token);
            }
        };

        checkSession();
    }, []);

    const getUserData = async (token: string) => {
        try {
            const response = await fetch(`${URL_BACK}/api/auth/profile/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setRole(data.role);
                setEmail(data.email);
            } else {
                Alert.alert('Error', 'No se pudo cargar los datos del perfil.');
            }
        } catch (err) {
            console.error('Error fetching profile data:', err);
            Alert.alert('Error', 'Hubo un problema al cargar los datos del perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('role');

        setUsername(null);
        setRole(null);
        setEmail(null);
        setShowRecommendationBar(false);
        navigation.navigate('Login');
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no puede deshacerse.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            if (!token) {
                                throw new Error('No token found');
                            }

                            const response = await fetch(`${URL_BACK}/api/auth/selfdelete`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (!response.ok) {
                                throw new Error('Failed to delete account');
                            }

                            Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
                            handleLogout();
                            navigation.navigate('Login');
                        } catch (err) {
                            Alert.alert('Error', 'Hubo un error al eliminar tu cuenta.');
                        }
                    },
                },
            ]
        );
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Por favor completa todos los campos.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError('Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setPasswordError('');

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('No token found', 'Please log in again.');
                return;
            }

            const response = await fetch(`${URL_BACK}/api/auth/update-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            Alert.alert('Contraseña cambiada', 'Tu contraseña ha sido cambiada correctamente.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setShowChangePasswordForm(false);
        } catch (err) {
            Alert.alert('Error', 'Hubo un problema al cambiar tu contraseña.');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
            </TouchableOpacity>
            <View style={styles.headerIcons}>
                {username ? (
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Text style={{ color: 'white', fontSize: 18, paddingTop: 5 }}>{username}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <FontAwesome name="user-circle" size={35} color="white" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowRecommendationBar(!showRecommendationBar)}>
                    <FontAwesome name="bars" size={35} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderRecommendationBar = () => {
        if (!showRecommendationBar) return null;
        return (
            <View style={styles.recommendationBar}>
                <TouchableOpacity
                    style={styles.recommendationButton}
                    onPress={() => {
                        setShowRecommendationBar(false);
                        navigation.navigate('Recommendations');
                    }}
                >
                    <Text style={styles.recommendationButtonText}>Te recomendamos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.recommendationButton}
                    onPress={() => {
                        setShowRecommendationBar(false);
                        navigation.navigate('ComingSoon');
                    }}
                >
                    <Text style={styles.recommendationButtonText}>Proximamente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.recommendationButton}
                    onPress={() => {
                        setShowRecommendationBar(false);
                        navigation.navigate('Help');
                    }}
                >
                    <Text style={styles.recommendationButtonText}>Ayudas</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderProfileDetails = () => (
        <View style={styles.mainContent}>
            <Text style={styles.profileTitle}>Bienvenido, {username}</Text>
            <Text style={styles.profileInfo}>Correo: {email}</Text>
            <Text style={styles.profileInfo}>Rol: {role}</Text>

            <TouchableOpacity onPress={() => setShowChangePasswordForm(!showChangePasswordForm)} style={styles.button}>
                <Text style={styles.buttonText}>
                    {showChangePasswordForm ? 'Ocultar Formulario' : 'Cambiar Contraseña'}
                </Text>
            </TouchableOpacity>

            {showChangePasswordForm && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña actual"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva contraseña"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar nueva contraseña"
                        secureTextEntry
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
                        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity onPress={handleDeleteAccount} style={styles.button}>
                <Text style={styles.buttonText}>Eliminar Cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('OrganizerRequestScreen')} style={styles.button}>
                <Text style={styles.buttonText}>Solicitar ser organizador</Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderRecommendationBar()}
            <View style={styles.mainContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#3498db" />
                ) : username ? (
                    renderProfileDetails()
                ) : (
                    <View>
                        <Text style={styles.profileTitle}>¡Bienvenido!</Text>
                        <Text style={styles.profileInfo}>No has iniciado sesión</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
                            <Text style={styles.buttonText}>Iniciar sesión</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <BottomNav navigation={navigation} role={role || ''} />
        </View>
    );
};

export default ProfileScreen;