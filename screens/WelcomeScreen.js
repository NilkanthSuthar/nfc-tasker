import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.user}>
          <Image
            source={require('./assets/logo_new.png')}
            style={styles.logo}
          />
          <Text style={styles.appTitle}>NFC TASKER</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome To Our App!</Text>
        <Text style={styles.description}>
          Experience the power of NFC technology with our IoT automation app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
     alignItems: 'center',
    paddingVertical: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  user: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
    // alignItems: 'center',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
