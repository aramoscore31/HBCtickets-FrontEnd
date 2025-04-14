import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface HeaderProps {
  navigation: any;
  username: string | null;
}

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ navigation, username }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          {username ? (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'white', fontSize: 18, paddingTop: 5 }}>{username}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <FontAwesome name="user-circle" size={35} color="white" />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={toggleMenu}>
            <FontAwesome name="bars" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.recommendationBar}>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Recommendations');
            }}
          >
            <Text style={styles.recommendationButtonText}>Cerca de ti</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ComingSoon');
            }}
          >
            <Text style={styles.recommendationButtonText}>Proximamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Categories');
            }}
          >
            <Text style={styles.recommendationButtonText}>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.recommendationButton}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Help');
            }}
          >
            <Text style={styles.recommendationButtonText}>Ayuda</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3498db',
  },
  logo: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
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

export default Header;
