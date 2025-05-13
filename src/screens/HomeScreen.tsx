import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import { styles } from '../css/HomeStyles';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import URL_BACK from '../config/urlBack';


const { width: screenWidth } = Dimensions.get('window');

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

const carouselItems = [
  { image: require('../assets/evento1.jpg') },
  { image: require('../assets/evento2.jpg') },
  { image: require('../assets/evento3.jpg') },
];

const renderCarouselItem = ({ item }: { item: { image: any } }) => {
  return (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
    </View>
  );
};

const formatEventTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [lastTicketsEvents, setLastTicketsEvents] = useState<EventData[]>([]);

  const opacity = useState(new Animated.Value(1))[0];

  // Fetch events and categories
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter/bypopular`);
      if (!response.ok) throw new Error('No se pudieron obtener los eventos.');

      const data: EventData[] = await response.json();

      const currentDate = new Date();
      const upcomingEvents = data.filter((event) => new Date(event.date) > currentDate);
      setEvents(upcomingEvents);
      setFilteredEvents(upcomingEvents);

      const culturalEvents = upcomingEvents.filter(event => event.categories.some(cat => cat.name.toLowerCase() === 'cultura'));
      setCulturalEvents(culturalEvents);

      const lastTickets = upcomingEvents.filter(event => event.availableTickets < 100);
      setLastTicketsEvents(lastTickets);
    } catch (err) {
      console.error('Error al obtener eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(`${URL_BACK}/api/events/filter/bydate`);
      if (!response.ok) throw new Error('No se pudieron obtener los eventos próximos.');
      const data: EventData[] = await response.json();

      const currentDate = new Date();
      const upcomingEvents = data.filter(event => new Date(event.date) > currentDate);
      setUpcomingEvents(upcomingEvents);
    } catch (err) {
      console.error('Error al obtener eventos próximos:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      fetchUpcomingEvents();
    }, [])
  );

  useEffect(() => {
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
      setLoading(false);
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter((event) => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const eventTitle = event.title ? event.title.toLowerCase() : '';
        const eventLocation = event.localizacion ? event.localizacion.toLowerCase() : '';

        const isTitleMatch = eventTitle.includes(lowercasedQuery);
        const isLocationMatch = eventLocation.includes(lowercasedQuery);

        return isTitleMatch || isLocationMatch;
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const handleEventPress = (item: EventData) => () => {
    navigation.navigate('EventDetails', { event: item });
  };

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    startBlinking();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Header navigation={navigation} username={username || ''} />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.carouselContainer}>
              <View style={styles.overlayContainer}>
                <Text style={styles.overlayText}>La forma más segura de comprar y vender entradas</Text>
                <View style={styles.searchBar}>
                  <FontAwesome name="search" size={20} color="#3498db" style={styles.searchIcon} />
                  <TextInput
                    placeholder="Buscar por ciudad o título de evento"
                    placeholderTextColor="white"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              <Carousel
                data={carouselItems}
                renderItem={renderCarouselItem}
                width={screenWidth}
                height={250}
                loop={true}
                autoPlay={true}
                autoPlayInterval={4000}
              />
            </View>

            <Text style={styles.sectionTitle}>Destacado</Text>
          </>
        }
        data={filteredEvents.slice(0, 9)}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.event} onPress={handleEventPress(item)}>
            <Image
              source={{ uri: `${URL_BACK}/uploaded-images/${item.imageUrl}` }}
              style={styles.eventImage}
            />
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>Últimas Entradas Disponibles</Text>
            <FlatList
              data={lastTicketsEvents}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.upcomingEvent} onPress={handleEventPress(item)}>
                  {/* Apply the blinking animation here */}
                  <Animated.View style={[styles.upcomingEvent, { opacity }]}>
                    <Image
                      source={{
                        uri: `${URL_BACK}/uploaded-images/${item.imageUrl}`,
                      }}
                      style={styles.upcomingEventImage}
                    />
                    <Text style={styles.upcomingEventTitle}>{item.title}</Text>
                    <View style={styles.upcomingEventTimeContainer}>
                      <FontAwesome name="clock-o" size={16} color="#FF6347" />
                      <Text style={styles.upcomingEventTime}>{formatEventTime(item.date)}</Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.sectionTitle}>Eventos Más Próximos</Text>
            <FlatList
              data={upcomingEvents}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.upcomingEvent} onPress={handleEventPress(item)}>
                  <Image
                    source={{ uri: `${URL_BACK}/uploaded-images/${item.imageUrl}` }}
                    style={styles.upcomingEventImage}
                  />
                  <Text style={styles.upcomingEventTitle}>{item.title}</Text>
                  <View style={styles.upcomingEventTimeContainer}>
                    <FontAwesome name="clock-o" size={16} color="#FF6347" />
                    <Text style={styles.upcomingEventTime}>{formatEventTime(item.date)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.sectionTitle}>Cultura</Text>
            <FlatList
              data={culturalEvents}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.upcomingEvent} onPress={handleEventPress(item)}>
                  <Image
                    source={{
                      uri: `${URL_BACK}/uploaded-images/${item.imageUrl}`,
                    }}
                    style={styles.upcomingEventImage}
                  />
                  <Text style={styles.upcomingEventTitle}>{item.title}</Text>
                  <View style={styles.culturalEventLocation}>
                    <FontAwesome name="map-marker" size={14} color="#888" style={styles.locationIcon} />
                    <Text style={styles.culturalEventLocationText}>{item.localizacion}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          <View style={{ height: 430 }} >
            <Footer />
          </View>
          </>
        }
      />

      <View style={styles.fixedBottomNav}>
        <BottomNav navigation={navigation} role={role || ''} />
      </View>
    </View>
  );
};

export default HomeScreen;
