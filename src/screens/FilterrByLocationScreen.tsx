import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CiudadStyles } from '../css/CiudadStyles';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import Header from '../components/Header';
import URL_BACK from '../config/urlBack';

interface EventData {
  id: number;
  title: string;
  date: string;
  localizacion: string;
  availableTickets: number;
  imageUrl: string;
  organizerUsername: string;
  description?: string;
  soldTickets?: number;
  categories?: { name: string }[];
}

const RecommendationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [localizacion, setLocalizacion] = useState('');
  const [events, setEvents] = useState<EventData[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showLocationTitle, setShowLocationTitle] = useState(false);
  const [noEventsMessage, setNoEventsMessage] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAllEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter/bydate`);
      if (response.ok) {
        const data: EventData[] = await response.json();

        const validatedEvents = data.map(event => ({
          ...event,
          description: event.description || '',
          soldTickets: event.soldTickets || 0,
          categories: event.categories || [],
        }));

        setEvents(validatedEvents);
        setErrorMessage('');
      } else {
        setNoEventsMessage('No se pudieron cargar los eventos.');
        setErrorMessage('Hubo un error al cargar los eventos');
      }
    } catch (error) {
      setErrorMessage('Hubo un error al cargar los eventos');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleEventPress = (item: EventData) => {
    navigation.navigate('EventDetails', { event: item });
  };

  const fetchEventsByLocation = async (localization: string) => {
    setLoadingEvents(true);
    setShowLocationTitle(true);
    setNoEventsMessage('');
    setErrorMessage('');
    setLocalizacion(localization);
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter?localizacion=${localization}`);
      if (response.ok) {
        const data: EventData[] = await response.json();

        const validatedEvents = data.map(event => ({
          ...event,
          description: event.description || '',
          soldTickets: event.soldTickets || 0,
          categories: event.categories || [],
        }));

        if (data.length === 0) {
          setNoEventsMessage('Actualmente no hay eventos en esta ciudad.');
        }
        setEvents(validatedEvents);
      } else {
        setNoEventsMessage('Hubo un problema al obtener los eventos.');
      }
    } catch (error) {
      setNoEventsMessage('Hubo un problema al obtener los eventos.');
    } finally {
      setLoadingEvents(false);
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
        setFavorites(data);
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const handleAddFavorite = async (eventId: any) => {
    const token = await AsyncStorage.getItem('token');
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

  const handleRemoveFavorite = async (eventId: any) => {
    const token = await AsyncStorage.getItem('token');
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

  useEffect(() => {
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  useEffect(() => {
    fetchFavorites();
    fetchAllEvents();
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={CiudadStyles.container} >
      <Header navigation={navigation} username={username || ''} />

      <Text style={CiudadStyles.text}>Filtrar por localización</Text>

      <View style={CiudadStyles.searchContainer}>
        <TextInput
          style={CiudadStyles.input}
          placeholder="Ingresa la localización"
          value={localizacion}
          onChangeText={setLocalizacion}
        />
        <FontAwesome
          name="search"
          size={20}
          color="#3498db"
          style={CiudadStyles.searchIcon}
          onPress={() => fetchEventsByLocation(localizacion)}
        />
      </View>

      <FlatList
        data={['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Granada', 'Malaga']}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchEventsByLocation(item)}>
            <View style={CiudadStyles.cityButton}>
              <Text style={CiudadStyles.cityText}>{item}</Text>
            </View>
            <View style={{ height: 20 }} />
          </TouchableOpacity>
        )}
        style={CiudadStyles.citiesList}
      />

      {showLocationTitle && !loadingEvents && (
        <Text style={CiudadStyles.title}>{`Eventos en ${localizacion}`}</Text>
      )}

      {errorMessage && !loadingEvents && (
        <View style={CiudadStyles.errorContainer}>
          <FontAwesome name="warning" size={40} color="#e74c3c" />
          <Text style={CiudadStyles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      {noEventsMessage && !loadingEvents && (
        <View style={CiudadStyles.noEventsContainer}>
          <FontAwesome name="frown-o" size={40} color="#e74c3c" />
          <Text style={CiudadStyles.noEventsMessage}>{noEventsMessage}</Text>
          <Text style={CiudadStyles.suggestionMessage}>Explora otras ciudades o vuelve a intentarlo.</Text>
          <TouchableOpacity
            style={CiudadStyles.retryButton}
            onPress={() => fetchEventsByLocation(localizacion)}
          >
            <Text style={CiudadStyles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {loadingEvents ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        !noEventsMessage && !errorMessage && (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isFavorite = favorites.includes(item.id);
              return (
                <TouchableOpacity onPress={() => handleEventPress(item)}>
                  <View style={CiudadStyles.event}>
                    <View style={CiudadStyles.eventImageContainer}>
                      <Image
                        source={{ uri: `${item.imageUrl}` }}
                        style={CiudadStyles.eventImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={CiudadStyles.eventDetails}>
                      <Text style={ComingSoonStyles.eventTitle}>{item.title}</Text>
                      <View style={CiudadStyles.locationContainer}>
                        <Text style={CiudadStyles.eventLocation}>{item.localizacion || 'Ubicación no disponible'}</Text>
                      </View>
                      <View style={CiudadStyles.eventMeta}>
                        <View style={CiudadStyles.dateContainer}>
                          <FontAwesome name="calendar" size={12} color="red" />
                          <Text style={CiudadStyles.eventDate}>{formatDate(item.date)}</Text>
                        </View>
                        <View style={CiudadStyles.ticketsContainer}>
                          <FontAwesome name="ticket" size={12} color="#3498db" />
                          <Text style={CiudadStyles.eventTickets}>
                            {item.availableTickets !== undefined ? item.availableTickets : 0} Tickets Disponibles
                          </Text>
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
                      style={CiudadStyles.favoriteIcon}
                    >
                      <FontAwesome
                        name="star"
                        size={25}
                        color={isFavorite ? CiudadStyles.favoriteIconActive.color : CiudadStyles.favoriteIconInactive.color}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )
      )}
    </View>
  );
};

export default RecommendationsScreen;
