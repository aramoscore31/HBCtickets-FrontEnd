import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../../app/index';

// Definir la interfaz de tipo EventData para los eventos
interface EventData {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  date: string;
  soldTickets: number;
  availableTickets: number;
  organizerUsername: string;
  localizacion: string;
  categories: { name: string }[];
}

// Formatear la fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

const ComingSoonScreen = () => {
  const [favorites, setFavorites] = useState<string[]>([]);  // List of favorite event ids
  const [events, setEvents] = useState<EventData[]>([]);  // List of events
  const [loading, setLoading] = useState(true);  // Loading state
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.87:8080/api/events/filter/bydate');
      if (!response.ok) throw new Error('No se pudieron obtener los eventos.');
      const data: EventData[] = await response.json();

      // Filtrar eventos que están en curso (la fecha del evento debe ser posterior a la fecha actual)
      const currentDate = new Date();
      const upcomingEvents = data.filter((event) => new Date(event.date) > currentDate);

      setEvents(upcomingEvents); // Solo eventos en curso
    } catch (err) {
      console.error('Error al obtener eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.87:8080/api/events/favorites/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);  // Store event IDs that are favorites
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  // Add event to favorites
  const handleAddFavorite = async (eventId: string) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás logueado. Por favor, inicia sesión.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.87:8080/api/events/favorites/add/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to add favorite');

      setFavorites((prevFavorites) => [...prevFavorites, eventId]);
      fetchFavorites();
    } catch (err) {
      console.error('Error al agregar a favoritos:', err);
    }
  };

  // Remove event from favorites
  const handleRemoveFavorite = async (eventId: string) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás logueado. Por favor, inicia sesión.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.87:8080/api/events/favorites/remove/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to remove favorite');

      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== eventId));
      fetchFavorites();
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
    }
  };

  // Navigate to event details
  const handleEventPress = (item: EventData) => {
    navigation.navigate('EventDetails', { event: item }); // Navegar a la pantalla de detalles del evento
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  return (
    <View style={ComingSoonStyles.container}>
      <Header navigation={navigation} username={username || ''} />

      <Text style={ComingSoonStyles.sectionTitle}>Eventos Próximos</Text>
      <FlatList
        data={events} // Solo muestra los eventos en curso
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          const formattedDate = formatDate(item.date);
          return (
            <TouchableOpacity
              onPress={() => handleEventPress(item)} // Navegar al detalle del evento
              style={ComingSoonStyles.event}
            >
              <View style={ComingSoonStyles.eventImageContainer}>
                <Image
                  source={{ uri: `http://192.168.1.87:8080/uploaded-images/${item.imageUrl}` }}
                  style={ComingSoonStyles.eventImage}
                />
              </View>
              <View style={ComingSoonStyles.eventDetails}>
                <Text style={ComingSoonStyles.eventTitle}>{item.title}</Text>
                <View style={ComingSoonStyles.locationContainer}>
                  <Text style={ComingSoonStyles.eventLocation}>{item.localizacion || 'Ubicación no disponible'}</Text>
                </View>
                <View style={ComingSoonStyles.eventMeta}>
                  <View style={ComingSoonStyles.dateContainer}>
                    <FontAwesome name="calendar" size={12} color="red" />
                    <Text style={ComingSoonStyles.eventDate}>{formattedDate}</Text>
                  </View>
                  <View style={ComingSoonStyles.ticketsContainer}>
                    <FontAwesome name="ticket" size={12} color="#3498db" />
                    <Text style={ComingSoonStyles.eventTickets}>{item.availableTickets}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (isFavorite) {
                    handleRemoveFavorite(item.id);
                  } else {
                    handleAddFavorite(item.id);
                  }
                }}
                style={ComingSoonStyles.favoriteIcon}
              >
                <FontAwesome
                  name="star"
                  size={25}
                  color={isFavorite ? 'gold' : 'gray'}  // Star color based on favorite status
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      style={{ marginBottom: 60 }} />
      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default ComingSoonScreen;