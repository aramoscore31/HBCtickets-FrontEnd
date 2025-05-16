import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { CiudadStyles } from '../css/CiudadStyles';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_BACK from '../config/urlBack';

const EventsByCategoryScreen = ({ route, navigation }: any) => {
  const { category } = route.params;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [noEventsMessage, setNoEventsMessage] = useState('');

  useEffect(() => {
    fetchEventsByCategory(category.id);
    fetchFavorites();
  }, [category]);

  const fetchEventsByCategory = async (categoryId: number) => {
    setLoading(true);
    setNoEventsMessage('');
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter?category=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setNoEventsMessage('No hay eventos disponibles para esta categoría.');
        }
        setEvents(data);
      } else {
        Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
      }
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los eventos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((event: any) => event.id));
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const handleAddFavorite = async (eventId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás logueado. Por favor, inicia sesión.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/add/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to add favorite');
      setFavorites((prevFavorites) => [...prevFavorites, eventId]);
    } catch (err) {
      console.error('Error al agregar a favoritos:', err);
    }
  };

  const handleRemoveFavorite = async (eventId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás logueado. Por favor, inicia sesión.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/remove/${eventId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== eventId));
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={CiudadStyles.container}>
      <Text style={CiudadStyles.text}>Eventos para la categoría: {category.name}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={CiudadStyles.loadingContainer} />
      ) : (
        <>
          {noEventsMessage && <Text style={CiudadStyles.noEventsMessage}>{noEventsMessage}</Text>}
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isFavorite = favorites.includes(item.id);
              return (
                <View style={CiudadStyles.event}>
                  <View style={CiudadStyles.eventImageContainer}>
                    <Image
                      source={{ uri: `${item.imageUrl}` }}
                      style={CiudadStyles.eventImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={CiudadStyles.eventDetails}>
                    <Text style={CiudadStyles.eventTitle}>{item.title}</Text>
                    <Text style={CiudadStyles.eventLocation}>{item.localizacion || 'Ubicación no disponible'}</Text>
                    <Text style={CiudadStyles.eventDate}>{formatDate(item.date)}</Text>
                    <Text style={CiudadStyles.eventTickets}>
                      {item.availableTickets} Tickets disponibles
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAddFavorite(item.id)} style={CiudadStyles.favoriteIcon}>
                    <FontAwesome name="star" size={25} color={isFavorite ? '#f39c12' : '#bdc3c7'} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}
    </View>
  );
};

export default EventsByCategoryScreen;
