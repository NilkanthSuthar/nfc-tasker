import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


const RemoteOverlayScreen = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    retrieveDevices();
  }, []);

  const retrieveDevices = async () => {
    try {
      const storedDevices = await AsyncStorage.getItem('devices');
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error('Error retrieving devices:', error);
    }
  };

  const [ipAddress, setIpAddress] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      retrieveIpAddress();
    }, [])
  );

  const retrieveIpAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('ipAddress');
      if (address !== null) {
        setIpAddress(address);
        console.log('IP Address retrieved:', address);
      }
    } catch (error) {
      console.log('Error retrieving IP address:', error);
    }
  };

  const sendPostRequest = (port, action) => {
    const message = `${action} ${port}`;
    fetch(`http://${ipAddress}/operate_relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        // Handle the response data if needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const renderDeviceItem = ({ item }) => {
    const toggleDeviceStatus = () => {
      const status = !item.status;
      sendPostRequest(item.port, item.action);
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.name === item.name) {
            return {
              ...device,
              status,
            };
          }
          return device;
        })
      );
    };
  
    return (
      <TouchableOpacity
        onPress={toggleDeviceStatus}
        style={[
          styles.deviceContainer,
          item.status && styles.deviceContainerPressed, // Apply the pressed style if the device is on
        ]}
      >
        <Text
          style={[
            styles.deviceName,
            item.status && styles.deviceNamePressed, // Apply the pressed style if the device is on
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.deviceInfo,
            item.status && styles.deviceInfoPressed, // Apply the pressed style if the device is on
          ]}
        >
          Port: {item.port} | Action: {item.action}
        </Text>
        <Text
          style={[
            styles.deviceStatus,
            item.status && styles.devicestatusPressed, // Apply the pressed style if the device is on
          ]}
        >
          {item.status ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Control</Text>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.name}
        style={styles.listContainer}
      />
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
  listContainer: {
    flex: 1,
  },
  deviceContainer: {
    backgroundColor: '#000000',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  deviceName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceInfo: {
    color: '#ffffff',
    fontSize: 14,
  },
  deviceStatus: {
    alignSelf: 'flex-end',
    color:'red'
  },
  deviceContainerPressed: {
    backgroundColor:'#fff',
    padding: 10,
    marginBottom: 10,
  },
  deviceNamePressed: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceInfoPressed: {
    color: '#000',
    fontSize: 14,
  },
  devicestatusPressed: {
    color: 'green',
    fontSize: 14,
  }
});

export default RemoteOverlayScreen;
