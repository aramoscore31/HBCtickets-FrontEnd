import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ComingSoonStyles } from '../css/ComingSoonStyles';
import { RootStackParamList } from '../../app/index';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import URL_BACK from '../config/urlBack';

const BoughtTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<'all' | 'ongoing' | 'past'>('all');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const fetchBoughtTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No se ha encontrado el token.');
        return;
      }

      const response = await fetch(`${URL_BACK}/api/tickets/view`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar los tickets comprados.');

      const data = await response.json();
      const updatedTickets = await Promise.all(data.map(async (ticket: { eventId: number, quantity: number }) => {
        const eventResponse = await fetch(`${URL_BACK}/api/events/${ticket.eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const eventDetails = await eventResponse.json();
        return {
          ...ticket,
          event: eventDetails,
        };
      }));

      setTickets(updatedTickets);
    } catch (error) {
      setError('Error al cargar los tickets comprados. Inténtalo nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedTicket(null);
  };

  const filterEvents = () => {
    const currentDate = new Date();
    if (eventStatus === 'ongoing') {
      return tickets.filter((ticket) => {
        const eventDate = new Date(ticket?.event?.date);
        return eventDate >= currentDate;
      });
    } else if (eventStatus === 'past') {
      return tickets.filter((ticket) => {
        const eventDate = new Date(ticket?.event?.date);
        return eventDate < currentDate;
      });
    }
    return tickets;
  };

  useEffect(() => {
    fetchBoughtTickets();
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  return (
    <View style={ComingSoonStyles.container}>
      <Header navigation={navigation} username={username || ''} />

      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', padding: 15, marginBottom: 10, borderTopWidth: 1, borderTopColor: 'white' }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center', flex: 1 }}>Entradas Compradas</Text>
      </View>

      {error && <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
        <TouchableOpacity
          onPress={() => setEventStatus('ongoing')}
          style={[ComingSoonStyles.filterButton, eventStatus === 'ongoing' && { backgroundColor: '#3498db' }]}
        >
          <Text style={[ComingSoonStyles.filterButtonText, eventStatus === 'ongoing' && { color: '#fff' }]}>En Curso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setEventStatus('past')}
          style={[ComingSoonStyles.filterButton, eventStatus === 'past' && { backgroundColor: '#3498db' }]}
        >
          <Text style={[ComingSoonStyles.filterButtonText, eventStatus === 'past' && { color: '#fff' }]}>Finalizadas</Text>
        </TouchableOpacity>
      </View>

      {tickets.length === 0 ? (
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 30 }}>No tienes entradas compradas.</Text>
      ) : (
        <FlatList
          data={filterEvents()}
          keyExtractor={(item, index) => `${item?.event?.id}-${index}`}
          renderItem={({ item }) => {
            const event = item?.event || {};
            const formattedDate = event.date ? new Date(event.date).toLocaleString() : 'Fecha no disponible';
            const isPastEvent = new Date(event.date) < new Date();

            return (
              <View style={[ComingSoonStyles.event, isPastEvent && { backgroundColor: '#e0e0e0' }]}>
                <View style={ComingSoonStyles.eventImageContainer}>
                  <Image
                    source={{ uri: `${event?.imageUrl || 'default-image.jpg'}` }}
                    style={ComingSoonStyles.eventImage}
                  />
                </View>
                <View style={ComingSoonStyles.eventDetails}>
                  <Text style={[ComingSoonStyles.eventTitle, isPastEvent && { color: '#999' }]}>{event?.title || 'Título no disponible'}</Text>
                  <View style={ComingSoonStyles.locationContainer}>
                    <Text style={[ComingSoonStyles.eventLocation, isPastEvent && { color: '#999' }]}>{event?.localizacion || 'Ubicación no disponible'}</Text>
                  </View>
                  <View style={ComingSoonStyles.eventMeta}>
                    <View style={ComingSoonStyles.dateContainer}>
                      <FontAwesome name="calendar" size={12} color="red" />
                      <Text style={[ComingSoonStyles.eventDate, isPastEvent && { color: '#999' }]}>{formattedDate}</Text>
                    </View>
                    <View style={ComingSoonStyles.ticketsContainer}>
                      <FontAwesome name="ticket" size={12} color="#3498db" />
                      <Text style={ComingSoonStyles.eventTickets}>{event?.availableTickets || '0'}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleTicketClick(item)} style={ComingSoonStyles.favoriteIcon}>
                  <FontAwesome name="qrcode" size={25} color="orange"/>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {selectedTicket && (
        <Modal visible={showQRModal} animationType="slide" transparent={true}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Código QR de la Entrada</Text>
              <QRCode value={selectedTicket?.code} size={200} />
              <TouchableOpacity onPress={closeQRModal} style={{ marginTop: 20 }}>
                <Text style={{ color: '#3498db', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

export default BoughtTickets;
