import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3498db',
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },

  mainContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },

  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2c3e50',
  },
  profileInfo: {
    fontSize: 18,
    marginBottom: 20,
    color: '#7f8c8d',
  },

  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#2c3e50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  input: {
    height: 50,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: '#f4f4f4',
  },

  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    fontStyle: 'italic',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalClose: {
    marginTop: 10,
  },
  modalCloseText: {
    color: 'red',
    fontSize: 16,
  },

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

  recommendationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  recommendationButton: {},

  recommendationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
