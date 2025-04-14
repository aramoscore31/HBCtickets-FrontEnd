import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  soldTickets: number;
  availableTickets: number;
  imageUrl: string;
  localizacion: string;
  price: number;
  organizerUsername: string;
  eventUrl: string;
  categories: string[];
}

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

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.1.87:8080/api/events/favorites/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load favorite events');

      const favoriteEventIds: number[] = await response.json();

      const eventDetailsPromises = favoriteEventIds.map(async (eventId: number) => {
        const eventResponse = await fetch(`http://192.168.1.87:8080/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return eventResponse.json();
      });

      const eventsDetails: Event[] = await Promise.all(eventDetailsPromises);
      setFavorites(eventsDetails);

    } catch (error) {
      setError('Error fetching your favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (eventId: number) => {
    const updatedFavorites = favorites.filter((event) => event.id !== eventId);
    setFavorites(updatedFavorites);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://192.168.1.87:8080/api/events/favorites/remove/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to remove favorite');
    } catch (error) {
      setError('Error removing favorite. Please try again later.');
      setFavorites(favorites);
    } finally {
      fetchFavorites();
    }
  };

  useEffect(() => {
    fetchFavorites();
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

      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', padding: 15, marginBottom: 10, borderTopWidth: 1, borderTopColor: 'white' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', alignItems: 'center', textAlignVertical: 'center', flex: 1 }}>Mis Favoritos</Text>
      </View>

      {error && <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>}

      {favorites.length === 0 ? (
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 30 }}>No tienes eventos favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const formattedDate = formatDate(item.date);
            return (
              <View style={ComingSoonStyles.event}>
                <View style={ComingSoonStyles.eventImageContainer}>
                  <Image
                    source={{ uri: `http://192.168.1.87:8080/uploaded-images/${item.imageUrl}` }}
                    style={ComingSoonStyles.eventImage}
                  />
                </View>
                <View style={ComingSoonStyles.eventDetails}>
                  <Text style={ComingSoonStyles.eventTitle}>{item.title}</Text>
                  <View style={ComingSoonStyles.locationContainer}>
                    <Text style={ComingSoonStyles.eventLocation}>
                      {item.localizacion || 'Ubicación no disponible'}
                    </Text>
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
                  onPress={() => handleRemoveFavorite(item.id)}
                  style={ComingSoonStyles.favoriteIcon}
                >
                  <FontAwesome name="star" size={25} color={ComingSoonStyles.favoriteIconActive.color} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default FavoritesScreen;
