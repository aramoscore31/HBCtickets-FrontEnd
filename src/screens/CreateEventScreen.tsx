import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import Header from '../components/Header';
import URL_BACK from '../config/urlBack';

type NavigationProps = StackNavigationProp<RootStackParamList, 'CreateEvent'>;

const CreateEventScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [availableTickets, setAvailableTickets] = useState('');
  const [price, setPrice] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [eventUrl, setEventUrl] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error al recuperar el token', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.log('No se encontró el username en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al recuperar el nombre de usuario', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${URL_BACK}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar las categorías', error);
    }
  };

  useEffect(() => {
    fetchToken();
    fetchUserData();
    fetchCategories();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleCreateEvent = async () => {
    if (!title || !date || !availableTickets || !price) {
      Alert.alert('Error', 'Debes completar al menos el título, la fecha, la cantidad de entradas y el precio.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'No se pudo recuperar el token de autenticación.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date.toISOString());
    formData.append('available_tickets', availableTickets);
    formData.append('price', price);
    formData.append('localizacion', localizacion);
    formData.append('event_url', eventUrl);

    selectedCategories.forEach((categoryId) => {
      formData.append('categories', categoryId.toString());
    });

    if (image) {
      const filename = image.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      formData.append('image', {
        uri: image,
        name: filename,
        type,
      } as any);
    }

    try {
      const response = await fetch(`${URL_BACK}/api/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const resText = await response.text();
      if (!response.ok) {
        Alert.alert('Error', resText);
      } else {
        Alert.alert('Éxito', resText);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'La imagen es demasiado grande o no se pudo subir.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: any) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Header navigation={navigation} username={username || 'Usuario no identificado'} />

      <Text style={styles.header}>Crear Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <DateTimePicker value={date} mode="datetime" display="default" onChange={onChangeDate} />

      <TextInput
        style={styles.input}
        placeholder="Entradas disponibles"
        value={availableTickets}
        onChangeText={setAvailableTickets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Localización"
        value={localizacion}
        onChangeText={setLocalizacion}
      />

      <TextInput
        style={styles.input}
        placeholder="URL del Evento (opcional)"
        value={eventUrl}
        onChangeText={setEventUrl}
      />

      <Text style={styles.inputLabel}>Categorías:</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category.id) && styles.selectedCategory
            ]}
            onPress={() => toggleCategory(category.id)}
          >
            <Text style={styles.categoryButtonText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{image ? 'Cambiar Imagen' : 'Seleccionar Imagen'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleCreateEvent}>
          <Text style={styles.submitButtonText}>Crear Evento</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginLeft: 20,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryButtonText: {
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});