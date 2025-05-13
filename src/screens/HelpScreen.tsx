import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native';
import { helpStyles } from '../css/HelpStyles';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

const HelpScreen = () => {
  const [buttonColor, setButtonColor] = useState(new Animated.Value(0));
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();


  const handleButtonPressIn = () => {
    Animated.timing(buttonColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.timing(buttonColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleContactSupport = () => {
    Linking.openURL('support.tickets@hbcavonni.com');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://www.tusitio.com');
  };

  const buttonBackgroundColor = buttonColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3498db', '#2980b9'],
  });

  useEffect(() => {
    const getUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedUsername) setUsername(storedUsername);
      if (storedRole) setRole(storedRole);
    };
    getUserData();
  }, []);

  return (
    <View style={helpStyles.container}>
      <Header navigation={navigation} username={username || ''} />
      <ScrollView>
        <View style={helpStyles.header}>
          <Text style={helpStyles.headerText}>Centro de Ayuda</Text>
        </View>

        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>Preguntas Frecuentes</Text>
          <Text style={helpStyles.question}>1. ¿Cómo crear una cuenta?</Text>
          <Text style={helpStyles.answer}>Para crear una cuenta, ve a la pantalla de registro, ingresa tus datos y presiona "Registrarse".</Text>

          <Text style={helpStyles.question}>2. ¿Cómo comprar entradas?</Text>
          <Text style={helpStyles.answer}>Selecciona el evento de tu interés y presiona "Comprar Entradas". Luego sigue los pasos para realizar el pago.</Text>

          <Text style={helpStyles.question}>3. ¿Puedo cancelar o modificar mi compra?</Text>
          <Text style={helpStyles.answer}>Una vez realizada la compra, no es posible cancelarla ni modificarla. Contacta con el soporte para más detalles.</Text>

          <Text style={helpStyles.question}>4. ¿Cómo ver los eventos cercanos a mí?</Text>
          <Text style={helpStyles.answer}>Activa la opción de ubicación para ver eventos cercanos. Puedes acceder a esta función desde la pantalla de inicio.</Text>
        </View>

        <View style={helpStyles.sectionSeparator} />

        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>Guías</Text>
          <Text style={helpStyles.guidesLink} onPress={() => handleVisitWebsite()}>
            Guía de uso completo
          </Text>
          <Text style={helpStyles.guidesLink} onPress={() => handleVisitWebsite()}>
            Preguntas frecuentes detalladas
          </Text>
        </View>

        <View style={helpStyles.sectionSeparator} />

        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>Soporte</Text>
          <Text style={helpStyles.contactText}>Si tienes algún problema o pregunta, contáctanos:</Text>
          <Animated.View
            style={[
              helpStyles.contactButton,
              { backgroundColor: buttonBackgroundColor },
            ]}
          >
            <TouchableOpacity
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              onPress={handleContactSupport}
              style={helpStyles.contactButton}
            >
              <Text style={helpStyles.contactButtonText}>Contactar con Soporte</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={helpStyles.sectionSeparator} />

        <View style={helpStyles.section}>
          <Text style={helpStyles.sectionTitle}>Términos y Condiciones</Text>
          <Text style={helpStyles.termsLink} onPress={() => handleVisitWebsite()}>
            Lee nuestros Términos y Condiciones
          </Text>
        </View>

      </ScrollView>
      <BottomNav navigation={navigation} role={role || ''} />
    </View>

  );
};

export default HelpScreen;
