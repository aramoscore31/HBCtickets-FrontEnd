import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import { styles } from '../css/AdminDashboardStyles';
import Header from '../components/Header';
import { FontAwesome } from '@expo/vector-icons';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Admin'>;

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminUsersScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No tienes permisos para ver esta página.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.87:8080/api/auth/profile/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de usuarios.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: unknown) {
      const err = error as Error;
      Alert.alert('Error', err.message || 'Hubo un problema al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  const handleEditUser = async (userId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No tienes permisos para editar.');
      return;
    }

    setEditingUserId(userId);

    setLoading(true);

    try {
      const response = await fetch(`http://192.168.1.87:8080/api/auth/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener los detalles del usuario.');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error: unknown) {
      const err = error as Error;
      Alert.alert('Error', err.message || 'Hubo un problema al cargar los datos del usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!userData) {
      Alert.alert('Error', 'No se encontraron datos para actualizar.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No tienes permisos para realizar esta acción.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://192.168.1.87:8080/api/auth/update/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario.');
      }

      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      setEditingUserId(null);
      setUserData(null);
      setLoading(false);

      fetchUsers();
    } catch (error: unknown) {
      const err = error as Error;
      Alert.alert('Error', err.message || 'Hubo un problema al actualizar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.role}>{item.role}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleEditUser(item.id)}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const handleInputChange = (name: string, value: string) => {
    if (userData) {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
          <FontAwesome name="plus-circle" size={30} color="white" />
          <Text style={styles.iconText}>AGREGAR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="home" size={30} color="white" />
          <Text style={styles.iconText}>INICIO</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
          <FontAwesome name="dashboard" size={30} color="white" />
          <Text style={styles.iconText}>ADMIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} username={username || ''} />

      {editingUserId ? (
        <View style={styles.editForm}>
          <Text style={styles.title}>Editar Usuario</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={userData?.username || ''}
            onChangeText={(text) => handleInputChange('username', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={userData?.email || ''}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Rol"
            value={userData?.role || ''}
            onChangeText={(text) => handleInputChange('role', text)}
          />

          <Button title="Actualizar Usuario" onPress={handleUpdateUser} />
          <Button title="Cancelar" onPress={() => setEditingUserId(null)} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      {loading && <ActivityIndicator size="large" color="#3498db" />}
      {renderBottomNav()}
    </View>
  );
};

export default AdminUsersScreen;
