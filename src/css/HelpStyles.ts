import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const helpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10, 
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50', 
    marginBottom: 15,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  answer: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginTop: 5,
  },
  guidesLink: {
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline',
    marginTop: 15,
    fontWeight: '600',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#3498db', 
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  termsLink: {
    fontSize: 16,
    color: '#3498db', 
    textDecorationLine: 'underline',
    marginTop: 10,
    fontWeight: '600',
  },
  sectionSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', 
    marginVertical: 15,
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
  buttonActive: {
    backgroundColor: '#1abc9c',
  },
});
