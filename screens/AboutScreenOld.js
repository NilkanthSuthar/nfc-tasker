import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AboutScreen = () => {
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Retrieve the saved IP address when the screen mounts
    retrieveIpAddress();
  }, []);

  const saveIpAddress = async (address) => {
    try {
      // Save the IP address to AsyncStorage
      await AsyncStorage.setItem('ipAddress', address);
      console.log('IP Address saved:', address);
    } catch (error) {
      console.log('Error saving IP address:', error);
    }
  };

  const retrieveIpAddress = async () => {
    try {
      // Retrieve the saved IP address from AsyncStorage
      const address = await AsyncStorage.getItem('ipAddress');
      if (address !== null) {
        setIpAddress(address);
        console.log('IP Address retrieved:', address);
      }
    } catch (error) {
      console.log('Error retrieving IP address:', error);
    }
  };

  const handleSaveIpAddress = () => {
    saveIpAddress(ipAddress);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Screen</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter IP Address:</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="Enter IP Address"
        />
      </View>
      <Button title="Save IP Address" onPress={handleSaveIpAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

//export default AboutScreen;
