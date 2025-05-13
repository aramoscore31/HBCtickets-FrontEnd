import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import URL_BACK from '../config/urlBack';

const AdminPanel = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(`${URL_BACK}/api/events/admin/panel`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('No tienes permisos para acceder a este panel');

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Error al obtener eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  const handleEditEvent = (eventId: number) => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDeleteEvent = async (eventId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${URL_BACK}/api/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar el evento');
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error('Error al eliminar el evento:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  return (
    <View style={ComingSoonStyles.container}>
      <Header navigation={navigation} username={username || ''} />

      <View style={ComingSoonStyles.headerContainer}>
        <Text style={ComingSoonStyles.headerText}>Panel de Administración</Text>
      </View>

      {error && <Text style={ComingSoonStyles.errorText}>{error}</Text>}

      {events.length === 0 ? (
        <Text style={ComingSoonStyles.noEventsText}>No hay eventos disponibles.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={ComingSoonStyles.event}>
              <View style={ComingSoonStyles.eventImageContainer}>
                <Image
                  source={{ uri: `${URL_BACK}/uploaded-images/${item.imageUrl}` }}
                  style={ComingSoonStyles.eventImage}
                />
              </View>
              <View style={ComingSoonStyles.eventDetails}>
                <Text style={ComingSoonStyles.eventTitle}>{item.title}</Text>
                <Text style={ComingSoonStyles.eventDate}>{item.date}</Text>
                <TouchableOpacity
                  onPress={() => handleEditEvent(item.id)}
                  style={ComingSoonStyles.actionButton}
                >
                  <FontAwesome name="edit" size={20} color="white" />
                  <Text style={ComingSoonStyles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteEvent(item.id)}
                  style={ComingSoonStyles.actionButton}
                >
                  <FontAwesome name="trash" size={20} color="white" />
                  <Text style={ComingSoonStyles.actionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default AdminPanel;
