import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patrocinadores:</Text>
        <View style={styles.patrocinadoresContainer}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => openUrl('https://www.staltra.es/')}>
            <Image source={require('../assets/patrocinadores/staltra.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer} onPress={() => openUrl('https://www.hbcavonni.com/')}>
            <Image source={require('../assets/patrocinadores/avonni2.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer} onPress={() => openUrl('https://www.hbcinnova.com/')}>
            <Image source={require('../assets/patrocinadores/innova.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer} onPress={() => openUrl('https://www.sbksocialclub.com/')}>
            <Image source={require('../assets/patrocinadores/taiko.png')} style={styles.logo} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoContainer} onPress={() => openUrl('https://www.sbksocialclub.com/')}>
            <Image source={require('../assets/patrocinadores/sbk.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer}>
            <Image source={require('../assets/patrocinadores/ja.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer}>
            <Image source={require('../assets/patrocinadores/js.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoContainer}>
            <Image source={require('../assets/patrocinadores/jm.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colaboradores:</Text>
        <TouchableOpacity style={styles.logoContainerc} onPress={() => openUrl('https://www.instagram.com/orale_padre')}>
          <Image source={require('../assets/colaboradores/orale-padre.png')} style={styles.logoc} />
        </TouchableOpacity>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.footerText}>© 2025 Todos los derechos reservados</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#3498db',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  patrocinadoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scrollView: {
    flexDirection: 'row',
  },
  logoContainer: {
    marginBottom: 10,
    width: '23%',
    alignItems: 'center',
  },
  logoContainerc: {
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
  },
  logoc: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Footer;
