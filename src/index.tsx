import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../src/screens/HomeScreen';
import LoginScreen from '../src/screens/LoginScreen';
import RegisterScreen from '../src/screens/RegisterScreen';
import RecommendationsScreen from './screens/FilterrByLocationScreen';
import ComingSoonScreen from '../src/screens/ComingSoonScreen';
import HelpScreen from '../src/screens/HelpScreen';
import CreateEventScreen from '../src/screens/CreateEventScreen';
import AdminUsersScreen from '@/src/screens/AdminUsersScreen';
import EventDetails from '@/src/screens/EventDetails';
import FavoritesScreen from '@/src/screens/FavoritesScreen';
import ProfileScreen from '@/src/screens/ProfileScreen';
import ShoppingCartScreen from '@/src/screens/ShoppingCartScreen';
import BoughtTickets from '@/src/screens/BoughtTickets';
import CategoriasScreen from '@/src/screens/CategoriasScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Recommendations: undefined;
  ComingSoon: undefined;
  Help: undefined;
  CreateEvent: undefined;
  Admin: undefined;
  EventDetails: { event: CustomEvent };
  Favorites: undefined;
  Profile: undefined;
  ShoppingCart: undefined;
  BoughtTickets: undefined;
  Categories: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="Admin" component={AdminUsersScreen} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} />
      <Stack.Screen name="BoughtTickets" component={BoughtTickets} />
      <Stack.Screen name="Categories" component={CategoriasScreen} />
    </Stack.Navigator>
  );
}
