import { StyleSheet } from 'react-native';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  event: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImageContainer: {
    marginRight: 10,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#ccc',
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 12,
    color: 'red',
    marginLeft: 4,
  },
  ticketsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTickets: {
    fontSize: 12,
    color: '#3498db',
    marginLeft: 4,
  },
  favoriteIcon: {
    padding: 8,
  },
  favoriteIconActive: {
    color: 'yellow',
  },
});
