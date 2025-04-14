import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const ComingSoonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3498db',
    padding: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  event: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 15,
  },
  eventImageContainer: {
    width: 85,
    height: 85,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  eventDate: {
    fontSize: 12,
    color: 'red',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  
  eventLocation: {
    fontSize: 13,
    color: '#bdc3c7',
    marginBottom: 4,
  },
  ticketsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTickets: {
    fontSize: 12,
    color: '#3498db',
    marginLeft: 5,
  },
  favoriteIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  favoriteIconInactive: {
    color: '#7f8c8d',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },  
  pastEvent: {
    backgroundColor: '#e0e0e0',  // Fondo gris claro para los eventos pasados
    borderColor: '#bdbdbd',  // Borde gris más oscuro
    borderWidth: 1,
  },
  pastEventText: {
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  ongoingButton: {
    backgroundColor: '#3498db',  // Azul vibrante para "En curso"
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  ongoingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Efecto hover para el botón En curso
  ongoingButtonPressed: {
    backgroundColor: '#2874A6', // Cambio de color cuando el botón es presionado
    borderColor: '#2874A6',
    transform: [{ scale: 0.98 }],  // Efecto de reducción para el click
  },

  // Botón Finalizadas
  completedButton: {
    backgroundColor: '#B0BEC5',  // Gris suave para "Finalizadas"
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  completedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Efecto hover para el botón Finalizadas
  completedButtonPressed: {
    backgroundColor: '#90A4AE',  // Cambio de color cuando el botón es presionado
    borderColor: '#90A4AE',
    transform: [{ scale: 0.98 }],  // Efecto de reducción para el click
  },
});