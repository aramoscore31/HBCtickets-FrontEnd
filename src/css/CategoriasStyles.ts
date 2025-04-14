import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const CategoriasStyles = StyleSheet.create({
  // Estilos generales para el contenedor principal
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

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },

  text: {
    fontSize: 24,
    marginBottom: 20,
  },

  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },

  categoryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  selectedCategory: {
    backgroundColor: '#1e6f96',
    borderColor: '#1e6f96',
    transform: [{ scale: 1.1 }],
  },

  categoryButtonTextSelected: {
    fontWeight: '700',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },

  noCategoriesMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 20,
  },

  event: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  eventImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  eventLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },

  eventDate: {
    fontSize: 12,
    color: '#e74c3c',
    marginVertical: 5,
  },

  eventTickets: {
    fontSize: 14,
    color: '#3498db',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  ticketsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

  filterButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },

  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  eventCategory: {
    marginBottom: 15,
  },

  eventCategoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  categoryText: {
    backgroundColor: '#3498db',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 20,
  },

});
