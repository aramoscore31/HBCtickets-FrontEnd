import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../../app/index';
import Header from '../components/Header';
import URL_BACK from '../config/urlBack';

interface CartItem {
  eventId: number;
  quantity: number;
  event: {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
    availableTickets: number;
    description: string;
    date: string;
    localizacion: string;
  };
}

const CartView = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
    }
  };

  const fetchCart = async () => {
    if (!token) {
      Alert.alert("Error", "No se ha encontrado el token de autenticación.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${URL_BACK}/api/events/cart/view`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const cartWithDetails = await Promise.all(data.map(async (item: { eventId: number, quantity: number }) => {
          const eventResponse = await fetch(`${URL_BACK}/api/events/${item.eventId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const eventDetails = await eventResponse.json();
          return {
            eventId: item.eventId,
            quantity: item.quantity,
            event: eventDetails,
          };
        }));

        setCartItems(cartWithDetails);
      } else {
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      Alert.alert("Error", "Hubo un problema al cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const removeFromCart = async (eventId: number) => {
    if (!token) {
      Alert.alert("Error", "No se ha encontrado el token de autenticación.");
      return;
    }

    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar este evento del carrito?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              const response = await fetch(`${URL_BACK}/api/events/cart/remove/${eventId}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                setCartItems(cartItems.filter(item => item.event.id !== eventId));
              } else {
                Alert.alert("Error", "No se pudo eliminar el evento del carrito.");
              }
            } catch (error) {
              console.error('Error al eliminar el evento:', error);
              Alert.alert("Error", "Hubo un problema al eliminar el evento del carrito.");
            }
          }
        }
      ]
    );
  };

  const updateQuantity = async (eventId: number, increment: boolean) => {
    const updatedItems = await Promise.all(cartItems.map(async (item) => {
      if (item.event.id === eventId) {
        if (increment && item.quantity < item.event.availableTickets) {
          item.quantity += 1;
        } else if (!increment && item.quantity > 1) {
          item.quantity -= 1;
        }

        try {
          const response = await fetch(`${URL_BACK}/api/events/cart/update/${eventId}?quantity=${item.quantity}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            Alert.alert("Error", "No se pudo actualizar la cantidad.");
          }
        } catch (error) {
          console.error("Error al actualizar la cantidad:", error);
          Alert.alert("Error", "Hubo un problema al actualizar la cantidad.");
        }
      }
      return item;
    }));

    setCartItems(updatedItems);
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.event.price * item.quantity;
    });
    return total.toFixed(2);
  };

  useEffect(() => {
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  const handleCheckout = async () => {
    const total = calculateTotal();

    if (parseFloat(total) <= 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`${URL_BACK}/api/purchases/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const paymentMessage = responseData.message || 'Compra completada exitosamente';
        Alert.alert('Compra completada', `Total pagado: $${total}. ${paymentMessage}`);
        setCartItems([]);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Hubo un problema al procesar la compra';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      Alert.alert('Error', 'Hubo un problema al procesar la compra.');
    }
  };


  return (
    <View style={styles.container}>
      <Header navigation={navigation} username={username || ''} />

      <Text style={styles.header}>Tu Carrito</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.event.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={{ uri: `${URL_BACK}/uploaded-images/${item.event.imageUrl}` }}
                style={styles.image}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.event.title}</Text>
                <Text style={styles.itemPrice}>${item.event.price.toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.event.id, false)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.event.id, true)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.event.id)}
              >
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyCart}>Tu carrito está vacío.</Text>
      )}

      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Terminar Compra</Text>
          </TouchableOpacity>
        </View>
      )}

<BottomNav navigation={navigation} role={role || ''} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantityText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 2,
    borderRadius: 10,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
  emptyCart: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  checkoutContainer: {
    marginTop: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {}
});

export default CartView;
