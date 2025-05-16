import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../app/index';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import { styles } from '../css/EventDetailsStyles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import {  Platform } from 'react-native';
import URL_BACK from '../config/urlBack';


type Category = {
  id: string;
  name: string;
};

interface Event {
  id: string;
  title: string;
  date: string;
  localizacion: string;
  imageUrl: string;
  availableTickets: number;
  price: number;
  categories: Category[];
  description: string;
}

const EventDetails = ({ route }: any) => {
  const { event } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const checkFavoriteStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const favorites = await response.json();
        setIsFavorite(favorites.includes(event.id));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = await AsyncStorage.getItem('token');
    const cantidad = 1;

    try {
      const response = await fetch(`${URL_BACK}/api/events/cart/add/${event.id}/${cantidad}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigation.navigate('ShoppingCart');
      } else if (response.status === 401) {
        Alert.alert('Error', 'Sesión expirada. Por favor, inicia sesión de nuevo.');
        navigation.navigate('Login');
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `No se pudo añadir al carrito: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      Alert.alert('Error', 'Hubo un problema al añadir al carrito.');
    }
  };

  const handleAddFavorite = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/add/${event.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsFavorite(true);
      } else {
        throw new Error('Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Error', 'Hubo un problema al agregar a favoritos.');
    }
  };

  const handleRemoveFavorite = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${URL_BACK}/api/events/favorites/remove/${event.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsFavorite(false);
      } else {
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar de favoritos.');
    }
  };

  const handleShare = async () => {
    const imageUrl = `${event.imageUrl}`;
    const eventUrl = `http://yourwebsite.com/event/${event.id}`;

    try {
      const localImageUri = await FileSystem.downloadAsync(imageUrl, FileSystem.documentDirectory + 'event_image.jpg');

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(localImageUri.uri, {
          mimeType: 'image/jpeg',
          dialogTitle: `Compartir evento: ${event.title}`,
        });
        console.log("Evento compartido con éxito.");
      } else {
        Alert.alert("Error", "No se puede compartir este contenido.");
      }
    } catch (error) {
      console.error('Error al compartir el evento:', error);
      Alert.alert("Error", "Hubo un problema al compartir el evento.");
    }
  };

 const handleOpenMap = () => {
  const loc = event.localizacion.trim();
  const isCoordinates = /^[-+]?(\d+(\.\d+)?),\s*[-+]?(\d+(\.\d+)?)$/.test(loc);
  let appUrl: string;
  let webUrl: string;

  if (isCoordinates) {
    if (Platform.OS === 'ios') {
      appUrl = `maps://maps.apple.com/?q=${loc}`;
    } else {
      appUrl = `geo:${loc}?q=${loc}`;
    }
    webUrl = `https://www.google.com/maps/search/?api=1&query=${loc}`;
  } else {
    const query = encodeURIComponent(loc);
    if (Platform.OS === 'ios') {
      appUrl = `maps://?q=${query}`;
    } else {
      appUrl = `geo:0,0?q=${query}`;
    }
    webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  Linking.canOpenURL(appUrl)
    .then(supported => {
      if (supported) {
        return Linking.openURL(appUrl);
      } else {
        return Linking.openURL(webUrl);
      }
    })
    .catch(err => console.error('Error al abrir mapas:', err));
};

  useEffect(() => {
    checkFavoriteStatus();
  }, [event]);

  useEffect(() => {
    (async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) setUsername(storedUsername);
    })();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#3498db"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header navigation={navigation} username={username || ''} />
        <View style={styles.eventContainer}>
          <Image
            source={{ uri: `${event.imageUrl}` }}
            style={styles.eventImage}
          />

          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.dateAndLocation}>
            <View style={styles.eventDate}>
              <Entypo name="calendar" size={20} color="#3498db" />
              <Text style={styles.dateText}>{new Date(event.date).toLocaleString()}</Text>
            </View>
            <View style={styles.eventLocation}>
              <FontAwesome name="map-marker" size={20} color="#3498db" />
              <TouchableOpacity onPress={handleOpenMap}>
                <Text style={styles.locationText}>{event.localizacion}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ticketsAndPrice}>
            <TouchableOpacity onPress={handleAddToCart}>
              <View style={styles.eventTickets}>
                <FontAwesome name="ticket" size={20} color="#3498db" />
                <Text style={styles.ticketsText}>{event.availableTickets}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddToCart}>
              <View style={styles.eventPrice}>
                <MaterialIcons name="attach-money" size={20} color="#3498db" />
                <Text style={styles.priceText}>{event.price}€</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <ScrollView>
              <View style={styles.categoriesContainer}>
                {event.categories.map((category: Category) => (
                  <Text key={category.id} style={styles.categoryText}>{category.name}</Text>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonContent}>
            <TouchableOpacity
              onPress={isFavorite ? handleRemoveFavorite : handleAddFavorite}
              style={styles.favoriteButton}>
              <FontAwesome name="star" size={25} color={isFavorite ? '#FFD700' : '#bdc3c7'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
              <Text style={styles.buttonText}>Comprar Entrada</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <FontAwesome name="share-alt" size={25} color="#3498db" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Información</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Localización</Text>
            <Text style={styles.descriptionText}>{event.localizacion}</Text>
            <TouchableOpacity onPress={handleOpenMap}>
              <Image style={styles.mapImage} source={require('../assets/mapa.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <Footer />
        <View style={{ height: 50 }} />
      </ScrollView>
      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default EventDetails;
