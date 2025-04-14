import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  scrollViewContent: {
    marginTop: 120,
    paddingBottom: 80,
  },

  fixedBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  culturalEvent: {
    width: 180,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    padding: 10,
  },

  culturalEventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },

  culturalEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    color: 'white',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3498db'
  },
  headerIcons: { flexDirection: 'row', gap: 15 },
  logo: { width: 90, height: 50, resizeMode: 'contain' },

  bannerContainer: {
    width: '100%',
    height: height * 0.3,
  },

  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profileInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },

  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  recommendationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  recommendationButton: {

  },

  recommendationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },




  eventList: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  event: {
    width: '33.3%',
    margin: 0,
  },

  eventImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },

  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center'
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalButton: { backgroundColor: '#3498db', padding: 10, width: '100%', borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  modalButtonText: { color: 'white', fontSize: 16 },
  modalClose: { marginTop: 10 },
  modalCloseText: { color: 'red', fontSize: 16 },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },

  carouselContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 70,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlayContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 2,
    alignItems: 'center',

  },

  overlayText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.53)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#3498db',
  },

  searchIcon: {
    marginRight: 10,
    color: '#3498db',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#3498db',
  },

  eventCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontStyle: 'italic',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    padding: 10,
    borderRadius: 10,
  },
  filterText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
  upcomingEventList: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 15,
  },

  upcomingEventContainer: {
    marginTop: 20,
    paddingVertical: 10,
  },

  upcomingEvent: {
    width: 180,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
  },

  upcomingEventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },

  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },

  upcomingEventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  upcomingEventTime: {
    fontSize: 14,
    marginLeft: 5,
    color: '#FF6347',
    fontWeight: 'bold',
  },

  timeIcon: {
    color: '#FF6347',
    marginRight: 5,
  },


  upcomingEventDetails: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },

  lastTicketsSection: {
    marginBottom: 20,
  },

  lastTicketsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 10,
  },

  eventBannerItem: {
    marginRight: 15,
    alignItems: 'center',
  },

  eventBannerImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  eventBannerTitle: {
    color: '#FF6347',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  culturalEventLocation: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  largeLogo: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },

});
