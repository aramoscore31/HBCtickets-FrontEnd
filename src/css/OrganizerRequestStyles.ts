import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 40,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1.5,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    color: '#333',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  inputError: {
    borderColor: '#e74c3c',
  },

  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },

  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  eventTypeButtonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingLeft: 10,
  },

  eventTypeButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginVertical: 10,
    marginRight: 10,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eventTypeButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },

  eventTypeButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  eventTypeButtonTextSelected: {
    color: '#fff',
  },

  eventTypeButtonIcon: {
    fontSize: 30,
    color: '#007bff',
  },

  eventTypeButtonIconSelected: {
    color: '#fff',
  },

  backButton: {
    marginTop: 30,
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },

  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 30,
  },
  eventTypeHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
