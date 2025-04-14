import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventContainer: {
    padding: 40,
  },
  eventImage: {
    width: 250,
    minHeight: 300,
    maxHeight: 1000,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
    marginLeft: 50,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginHorizontal: 5,
  },
  dateAndLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginRight: 50,
    marginLeft: 40,
  },
  ticketsAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 110,
  },
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  eventTickets: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 5,
  },
  ticketsText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#34495e',
  },
  ticketInfo: {
    marginBottom: 20,
  },
  infoButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  favoriteButton: {
    marginRight: 20,
  },
  buyButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  shareButton: {
    marginLeft: 20,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    marginHorizontal: -100,
    color: 'white',
  },
  infoText: {
    fontSize: 16,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#3498db',
    marginRight: 10,
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },

  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3498db',
  },
  descriptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  mapImage: {
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 15,
    alignSelf: 'center',
  },
});
