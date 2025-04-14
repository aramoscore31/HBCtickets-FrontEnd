import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

type RootStackParamList = {
  EditEvent: { eventId: number };
};

type EditEventScreenProps = {
  navigation: any;
  route: any;
};

interface EventData {
  title: string;
  description: string;
  date: string;
  availableTickets: number;
  price: number;
  localizacion: string;
  imageUrl: string;
  eventUrl: string;
  categories: any[];
}

const EditEventScreen = ({ route, navigation }: EditEventScreenProps) => {
  const { eventId } = route.params;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(`http://192.168.1.87:8080/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener los detalles del evento');

        const data = await response.json();
        setEventData(data);
        setImageUri(data.imageUrl);
        setSelectedCategories(data.categories.map((cat: any) => cat.id));
      } catch (err) {
        Alert.alert('Error', 'No se pudo cargar el evento.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.87:8080/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar las categorías', error);
      }
    };

    fetchEvent();
    fetchCategories();
  }, [eventId]);

  const handleSave = async () => {
    if (!eventData) return;

    const token = await AsyncStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('available_tickets', eventData.availableTickets.toString());
      formData.append('price', eventData.price.toString());
      formData.append('localizacion', eventData.localizacion);
      formData.append('event_url', eventData.eventUrl);

      selectedCategories.forEach((categoryId) => {
        formData.append('categories', categoryId.toString());
      });

      if (imageUri && imageUri !== eventData.imageUrl) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename!);
        const type = match ? `image/${match[1]}` : 'image';
        const imageBlob = {
          uri: imageUri,
          name: filename!,
          type: type,
        };
        formData.append('image', imageBlob as any);
      }

      const response = await fetch(`http://192.168.1.87:8080/api/events/edit/${eventId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Error al guardar los cambios');

      Alert.alert('Éxito', 'Evento actualizado correctamente');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    }
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería de imágenes.');
    }
  };

  const toggleCategory = (categoryId: any) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  const currentImageUrl = imageUri ? imageUri : `http://192.168.1.87:8080/uploaded-images/${eventData?.imageUrl}`;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Editar Evento</Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={eventData?.title || ''}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, title: text } : null)}
        />

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={eventData?.description || ''}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, description: text } : null)}
        />

        <TextInput
          style={styles.input}
          placeholder="Fecha"
          value={eventData?.date || ''}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, date: text } : null)}
        />

        <TextInput
          style={styles.input}
          placeholder="Entradas disponibles"
          value={String(eventData?.availableTickets ?? '')}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, availableTickets: parseInt(text) } : null)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={String(eventData?.price ?? '')}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, price: parseInt(text) } : null)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Localización"
          value={eventData?.localizacion || ''}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, localizacion: text } : null)}
        />

        <TextInput
          style={styles.input}
          placeholder="URL del Evento"
          value={eventData?.eventUrl || ''}
          onChangeText={(text) => setEventData((prevState) => prevState ? { ...prevState, eventUrl: text } : null)}
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

        <Image source={{ uri: currentImageUrl }} style={styles.image} />

        <Button title="Seleccionar Imagen" onPress={handleImagePick} />

        <Button title="Guardar Cambios" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    margin: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
});

export default EditEventScreen;
