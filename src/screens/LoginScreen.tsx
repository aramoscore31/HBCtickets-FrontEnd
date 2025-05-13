import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_BACK from '../config/urlBack';

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch(`${URL_BACK}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(async data => {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('role', data.role);

          const token = data.token;
          const authHeader = `Bearer ${token}`;

          const headers = {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          };

          navigation.navigate('Home');
        } else {
          Alert.alert('Error', data.message || 'Credenciales incorrectas');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Credenciales incorrectas');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        onChangeText={setUsername}
        value={username}
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </Text>
      <Text style={styles.link} onPress={() => navigation.navigate('Home')}>
        Volver al Inicio.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderBottomWidth: 1, marginVertical: 10 },
  link: { textAlign: 'center', color: 'blue', marginTop: 10 },
});

export default LoginScreen;
