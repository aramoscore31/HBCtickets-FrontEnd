import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoriasStyles } from '../css/CategoriasStyles';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import URL_BACK from '../config/urlBack';

interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  title: string;
  imageUrl: string;
  availableTickets: number;
  localizacion: string;
  date: string;
  categories: Category[];
}

const CategoriasScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [noCategoriesMessage, setNoCategoriesMessage] = useState('');
  const [noEventsMessage, setNoEventsMessage] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchEvents();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((e: any) => e.id));
      } else {
        console.error('Error al cargar favoritos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${URL_BACK}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setNoCategoriesMessage('No se pudieron cargar las categorías.');
      }
    } catch (error) {
      console.error('Error al cargar las categorías', error);
      setNoCategoriesMessage('Hubo un problema al cargar las categorías.');
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter/bydate`);
      if (response.ok) {
        const data = await response.json();
        const enrichedEvents: Event[] = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          imageUrl: event.imageUrl,
          availableTickets: event.availableTickets,
          localizacion: event.localizacion,
          date: event.date,
          categories: event.categories || [], 
        }));
        setEvents(enrichedEvents);
      } else {
        setNoEventsMessage('No se pudieron cargar los eventos.');
      }
    } catch (error) {
      console.error('Error al cargar los eventos', error);
      setNoEventsMessage('Hubo un problema al cargar los eventos.');
    } finally {
      setLoading(false);
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

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddFavorite = async (eventId: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No estás logueado. Por favor, inicia sesión.');
      navigation.navigate('Login');
      return;
    }
    try {
      const response = await fetch(
        `${URL_BACK}/api/events/favorites/add/${eventId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Error al agregar favorito');
      setFavorites(prev => [...prev, eventId]);
    } catch (err) {
      console.error('Error al agregar a favoritos:', err);
      Alert.alert('No se pudo agregar el evento a favoritos.');
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
      const response = await fetch(
        `${URL_BACK}/api/events/favorites/remove/${eventId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Error al eliminar favorito');
      setFavorites(prev => prev.filter(id => id !== eventId));
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      Alert.alert('No se pudo eliminar el evento de favoritos.');
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const filterEventsByCategories = () => {
    if (selectedCategories.length === 0) return events;
    return events.filter(evt =>
      evt.categories.some(cat => selectedCategories.includes(cat.id))
    );
  };

  return (
    <View style={CategoriasStyles.container}>
      <Header navigation={navigation} username={username || ''} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3498db"
          style={CategoriasStyles.loadingContainer}
        />
      ) : (
        <>
          {noCategoriesMessage.length > 0 && (
            <Text style={CategoriasStyles.noCategoriesMessage}>
              {noCategoriesMessage}
            </Text>
          )}

          <View style={CategoriasStyles.categoriesContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  CategoriasStyles.categoryButton,
                  selectedCategories.includes(cat.id) &&
                    CategoriasStyles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(cat.id)}
              >
                <Text
                  style={[
                    CategoriasStyles.categoryButtonText,
                    selectedCategories.includes(cat.id) &&
                      CategoriasStyles.categoryButtonTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={CategoriasStyles.sectionTitle}>
            Eventos Disponibles
          </Text>
          {noEventsMessage.length > 0 && (
            <Text style={CategoriasStyles.noCategoriesMessage}>
              {noEventsMessage}
            </Text>
          )}

          <FlatList
            data={filterEventsByCategories()}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const isFav = favorites.includes(item.id);
              return (
                <View style={ComingSoonStyles.event}>
                  <View style={ComingSoonStyles.eventImageContainer}>
                    <Image
                      source={{
                        uri: `${URL_BACK}/uploaded-images/${item.imageUrl}`,
                      }}
                      style={ComingSoonStyles.eventImage}
                    />
                  </View>
                  <View style={ComingSoonStyles.eventDetails}>
                    <Text style={ComingSoonStyles.eventTitle}>
                      {item.title}
                    </Text>
                    <View style={ComingSoonStyles.locationContainer}>
                      <Text style={ComingSoonStyles.eventLocation}>
                        {item.localizacion || 'Ubicación no disponible'}
                      </Text>
                    </View>
                    <View style={ComingSoonStyles.eventMeta}>
                      <View style={ComingSoonStyles.dateContainer}>
                        <FontAwesome
                          name="calendar"
                          size={12}
                          color="red"
                        />
                        <Text style={ComingSoonStyles.eventDate}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                      <View style={ComingSoonStyles.ticketsContainer}>
                        <FontAwesome
                          name="ticket"
                          size={12}
                          color="#3498db"
                        />
                        <Text style={ComingSoonStyles.eventTickets}>
                          {item.availableTickets}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      isFav
                        ? handleRemoveFavorite(item.id)
                        : handleAddFavorite(item.id)
                    }
                    style={ComingSoonStyles.favoriteIcon}
                  >
                    <FontAwesome
                      name="star"
                      size={25}
                      color={isFav ? 'gold' : 'gray'}
                    />
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

export default CategoriasScreen;
