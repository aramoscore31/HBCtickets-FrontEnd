import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);  // Lista de categorías seleccionadas
  const [noCategoriesMessage, setNoCategoriesMessage] = useState('');
  const [noEventsMessage, setNoEventsMessage] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchEvents();
    fetchFavorites();
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.87:8080/api/events/filter/bydate');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
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
        setFavorites(data.map((event: any) => event.id));
      }
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }
  };

  const handleCategorySelect = (category: any) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const filterEventsByCategories = () => {
    if (selectedCategories.length === 0) {
      return events;
    }
    return events.filter((event) =>
      event.categories.some((category: { id: number }) => selectedCategories.includes(category.id))
    );
  };

  return (
    <View style={CategoriasStyles.container}>
      <Header navigation={navigation} username={username || ''} />
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
              const isFavorite = favorites.includes(item.id);
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
                   
                    style={ComingSoonStyles.favoriteIcon}
                  >
                    <FontAwesome
                      name="star"
                      size={25}
                      color={isFavorite ? ComingSoonStyles.favoriteIconActive.color : ComingSoonStyles.favoriteIconInactive.color}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      )}
      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default CategoriasScreen;
