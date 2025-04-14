import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PurchaseTicket = ({ route, navigation }: any) => {
  const { event } = route.params;
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);

  const handlePurchase = () => {
    if (ticketQuantity <= 0 || ticketQuantity > event.availableTickets) {
      Alert.alert('Error', 'Cantidad de entradas no válida.');
      return;
    }

    Alert.alert('Compra exitosa', `Has comprado ${ticketQuantity} entradas para el evento: ${event.title}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDate}>{new Date(event.date).toLocaleString()}</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>

      <TextInput
        style={styles.input}
        placeholder="Cantidad de entradas"
        value={ticketQuantity.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setTicketQuantity(Number(text))}
      />

      <TouchableOpacity style={styles.button} onPress={handlePurchase}>
        <Text style={styles.buttonText}>Comprar Entradas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PurchaseTicket;
``
