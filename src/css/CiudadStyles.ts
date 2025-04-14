import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const CiudadStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
  },

  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 14,
  },

  searchIcon: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },

  citiesList: {
    marginVertical: 20,
    paddingBottom: 10,
  },
  cityButton: {
    backgroundColor: '#2980b9',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  cityButtonPressed: {
    backgroundColor: '#3498db',
    transform: [{ scale: 0.98 }],
  },
  cityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',

  },
  container: {
  },
  text: {
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

  eventItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
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
  noEventsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  noEventsMessage: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
  },
  suggestionMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventOrganizer: {
    fontSize: 12,
    color: '#e67e22',
    marginTop: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#721c24',
    textAlign: 'center',
    marginTop: 10,
  },

});
