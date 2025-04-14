import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../css/OrganizerRequestStyles';
import { FontAwesome } from '@expo/vector-icons';

const OrganizerRequestScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const eventTypes = [
    { name: 'Deportivo', icon: 'soccer-ball-o' },
    { name: 'Cultural', icon: 'music' },
    { name: 'Académico', icon: 'graduation-cap' },
    { name: 'Corporativo', icon: 'building' },
    { name: 'Otro', icon: 'ellipsis-h' }
  ];

  const toggleEventType = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleRequestOrganizer = async () => {
    if (!username || !reason || !experience || selectedEventTypes.length === 0) {
      setFormError('Por favor completa todos los campos.');
      return;
    }

    setFormError('');

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('No token found', 'Please log in again.');
        return;
      }

      const response = await fetch('http://192.168.1.87:8080/api/auth/request-organizer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          reason,
          experience,
          eventTypes: selectedEventTypes,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setUsername('');
        setReason('');
        setExperience('');
        setSelectedEventTypes([]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to request organizer role');
      }

    } catch (err) {
      Alert.alert('Error', err.message || 'Hubo un problema al enviar tu solicitud.');
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successMessage}>¡Solicitud Enviada Exitosamente!</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.formTitle}>Solicitar el rol de organizador</Text>

      <TextInput
        style={[styles.input, !username && styles.inputError]}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={[styles.input, !reason && styles.inputError]}
        placeholder="Motivo de la solicitud"
        value={reason}
        onChangeText={setReason}
        placeholderTextColor="#A0A0A0"
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={[styles.input, !experience && styles.inputError]}
        placeholder="Experiencia previa (opcional)"
        value={experience}
        onChangeText={setExperience}
        placeholderTextColor="#A0A0A0"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.eventTypeHeader}>
        Selecciona los tipos de eventos que deseas organizar:
      </Text>

      <FlatList
        data={eventTypes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.eventTypeButton,
              selectedEventTypes.includes(item.name) && styles.eventTypeButtonSelected,
            ]}
            onPress={() => toggleEventType(item.name)}
          >
            <FontAwesome
              name={item.icon}
              style={[
                styles.eventTypeButtonIcon,
                selectedEventTypes.includes(item.name) && styles.eventTypeButtonIconSelected,
              ]}
            />
            <Text
              style={[
                styles.eventTypeButtonText,
                selectedEventTypes.includes(item.name) && styles.eventTypeButtonTextSelected,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventTypeButtonContainer}
      />

      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

      <TouchableOpacity onPress={handleRequestOrganizer} style={styles.button}>
        <Text style={styles.buttonText}>Solicitar ser organizador</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrganizerRequestScreen;
