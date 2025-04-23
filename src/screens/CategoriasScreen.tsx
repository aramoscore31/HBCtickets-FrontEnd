import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoriasStyles } from '../css/CategoriasStyles';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const CategoriasScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);  // Lista de eventos favoritos
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);  // Categorías seleccionadas
  const [noCategoriesMessage, setNoCategoriesMessage] = useState('');
  const [noEventsMessage, setNoEventsMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchEvents();
    loadFavorites();  // Cargar favoritos al inicio
  }, []);

  // Función para cargar los favoritos desde el backend
  const loadFavorites = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.87:8080/api/events/favorites/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);  // Guardamos los IDs de los eventos favoritos
      } else {
        console.error('Error al cargar favoritos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    }
  };

  // Función para cargar las categorías
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.87:8080/api/categories');
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

  // Función para cargar los eventos
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.87:8080/api/events/filter/bydate');
      if (response.ok) {
        const data = await response.json();
        const simplifiedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          imageUrl: event.imageUrl,
          availableTickets: event.availableTickets,
          localizacion: event.localizacion,
          date: event.date,
        }));
        setEvents(simplifiedEvents);
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

  // Función para seleccionar las categorías
  const handleCategorySelect = (category: any) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  // Función para manejar la adición de favoritos
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
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error al agregar a favoritos: ${errorDetails.message || 'Error desconocido'}`);
      }

      const updatedFavorites = [...favorites, eventId];
      setFavorites(updatedFavorites);  // Actualizamos los favoritos
    } catch (err) {
      console.error('Error al agregar a favoritos:', err);
      Alert.alert('No se pudo agregar el evento a favoritos.');
    }
  };

  // Función para manejar la eliminación de favoritos
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
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      const updatedFavorites = favorites.filter((id) => id !== eventId);
      setFavorites(updatedFavorites);  // Actualizamos los favoritos
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      Alert.alert('No se pudo eliminar el evento de favoritos.');
    }
  };

  // Filtrar eventos por categorías seleccionadas
  const filterEventsByCategories = () => {
    if (selectedCategories.length === 0) {
      return events;
    }
    return events.filter((event) =>
      event.categories?.some((category: { id: number }) => selectedCategories.includes(category.id))
    );
  };

  return (
    <View style={CategoriasStyles.container}>
      <Header navigation={navigation} username ={""}/>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={CategoriasStyles.loadingContainer} />
      ) : (
        <>
          {noCategoriesMessage && <Text style={CategoriasStyles.noCategoriesMessage}>{noCategoriesMessage}</Text>}

          <View style={CategoriasStyles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  CategoriasStyles.categoryButton,
                  selectedCategories.includes(category.id) && CategoriasStyles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    CategoriasStyles.categoryButtonText,
                    selectedCategories.includes(category.id) && CategoriasStyles.categoryButtonTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={CategoriasStyles.sectionTitle}>Eventos Disponibles</Text>
          {noEventsMessage && <Text style={CategoriasStyles.noCategoriesMessage}>{noEventsMessage}</Text>}

          <FlatList
            data={filterEventsByCategories()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isFavorite = favorites.includes(item.id);  // Verifica si el evento está en los favoritos
              const formattedDate = new Date(item.date).toLocaleDateString();
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
                        handleRemoveFavorite(item.id);  // Eliminar de favoritos
                      } else {
                        handleAddFavorite(item.id);  // Agregar a favoritos
                      }
                    }}
                    style={ComingSoonStyles.favoriteIcon}
                  >
                    <FontAwesome
                      name="star"
                      size={25}
                      color={isFavorite ? 'gold' : 'gray'}  // Estrella dorada si es favorito
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}
      <BottomNav navigation={navigation} role={''} />
    </View>
  );
};

export default CategoriasScreen;