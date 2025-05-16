import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import URL_BACK from '../config/urlBack';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'EventDetails'>>();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load favorite events');
      const favoriteEventIds: number[] = await response.json();

      const details = await Promise.all(
        favoriteEventIds.map(async id => {
          const res = await fetch(`${URL_BACK}/api/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return (await res.json()) as Event;
        })
      );
      setFavorites(details);
    } catch (err) {
      setError('Error fetching your favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (eventId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${URL_BACK}/api/events/favorites/remove/${eventId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setFavorites(prev => prev.filter(evt => evt.id !== eventId));
    } catch {
      Alert.alert('Error', 'No se pudo eliminar de favoritos.');
    }
  };

  useEffect(() => {
    fetchFavorites();
    (async () => {
      const u = await AsyncStorage.getItem('username');
      const r = await AsyncStorage.getItem('role');
      if (u) setUsername(u);
      if (r) setRole(r);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" style={{ flex: 1 }} />;
  }

  return (
    <View style={ComingSoonStyles.container}>
      <Header navigation={navigation} username={username || ''} />

      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', padding: 15, marginBottom: 10, borderTopWidth: 1, borderTopColor: 'white' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Mis Favoritos
        </Text>
      </View>

      {error && <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>}

      {favorites.length === 0 ? (
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 30 }}>
          No tienes eventos favoritos.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const formattedDate = formatDate(item.date);
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('EventDetails', { event: item })}
              >
                <View style={ComingSoonStyles.event}>
                  <View style={ComingSoonStyles.eventImageContainer}>
                    <Image
                      source={{ uri: `${item.imageUrl}` }}
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
                    <FontAwesome name="star" size={25} color="gold" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default FavoritesScreen;