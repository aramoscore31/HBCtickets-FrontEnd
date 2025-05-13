import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../app/index';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_BACK from '../config/urlBack';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const registerResponse = await fetch(`${URL_BACK}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        console.error("Error del servidor al registrar:", errorText);
        Alert.alert('Error', 'Hubo un problema al registrar el usuario: ' + errorText);
        return;
      }

      const registerMessage = await registerResponse.text();
      console.log(registerMessage);

      if (registerMessage.includes("Usuario registrado exitosamente")) {
        const loginResponse = await fetch(`${URL_BACK}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!loginResponse.ok) {
          const errorText = await loginResponse.text();
          console.error("Error del servidor al loguear:", errorText);
          Alert.alert('Error', 'Hubo un problema al iniciar sesión: ' + errorText);
          return;
        }

        const loginData = await loginResponse.json();
        if (loginData.token) {
          await AsyncStorage.setItem('token', loginData.token);
          await AsyncStorage.setItem('username', username);

          navigation.navigate('Home');
        } else {
          Alert.alert('Error', 'Hubo un error al iniciar sesión después del registro');
        }
      } else {
        Alert.alert('Error', 'Hubo un error al registrar el usuario: ' + registerMessage);
      }
    } catch (error) {
      console.error('Error en el registro o login:', error);
      Alert.alert('Error', 'No se pudo realizar el registro o login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver al Inicio.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18 },
  link: { marginTop: 10, textAlign: 'center' },
});

export default RegisterScreen;
