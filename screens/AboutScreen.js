import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const developers = [
  {
    name: 'Nilkanth Suthar',
    linkedInUrl: 'https://www.linkedin.com/in/nilkanthsuthar/',
  },
  {
    name: 'Vinit Shingala',
    linkedInUrl: 'https://www.linkedin.com/in/vinit-shingala-695608234/',
  }
];

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

  const handleOpenLinkedIn = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Created by:</Text>
      {developers.map((developer, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleOpenLinkedIn(developer.linkedInUrl)}
          style={styles.developerContainer}
        >
          <View>
            <Text style={styles.developerInfo}>{developer.name}</Text>
            <Text style={styles.developerInfo}>Enrollment Number: {developer.enrollmentNumber}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.ipAddress}>Configured IP Address: {ipAddress}</Text>

      <Text style={styles.label}>Enter IP Address:</Text>
      <TextInput
        style={styles.input}
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholder="Enter IP Address"
      />

      <Button title="Save IP Address" onPress={handleSaveIpAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  developerContainer: {
    backgroundColor: '#000000',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  developerInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff',
  },
  ipAddress: {
    fontSize: 16,
    marginBottom: 20,
    color: '#ffffff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AboutScreen;
