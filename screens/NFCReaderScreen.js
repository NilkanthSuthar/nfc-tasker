import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, BackHandler } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function NFCReaderScreen({ navigation }) {
  const [ndefMessage, setNdefMessage] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [nfcRequestInProgress, setNfcRequestInProgress] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
      NfcManager.cancelTechnologyRequest();
      NfcManager.unregisterTagEvent();
    };
  }, []);

  const [ipAddress, setIpAddress] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      retrieveIpAddress();
    }, [])
  );

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkNfcEnabled();
    }
  }, []);

  const handleBackPress = () => {
    setIsScanning(false);
    return false;
  };

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

  const checkNfcEnabled = async () => {
    try {
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        showNfcDisabledAlert();
      }
    } catch (ex) {
      console.warn('Oops!', ex);
    }
  };

  const showNfcDisabledAlert = () => {
    Alert.alert(
      'NFC Disabled',
      'Please enable NFC in your device settings to use this feature.',
      [
        {
          text: 'Go to Settings',
          onPress: () => NfcManager.goToNfcSetting(),
        },
        {
          text: 'Cancel',
          onPress: () => setIsScanning(false),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const readNdef = async () => {
    if (nfcRequestInProgress) {
      return; // Prevent requesting NFC multiple times
    }

    try {
      setNfcRequestInProgress(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const parsedNdefMessage = tag.ndefMessage.map((record) => {
          if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
            const textPayload = Ndef.text.decodePayload(record.payload);
            const payload = textPayload.slice(textPayload.indexOf(':') + 1);
            return {
              ...record,
              payload,
            };
          }
          return record;
        });
        setNdefMessage(parsedNdefMessage);
        displayMessage(parsedNdefMessage);
      } else {
        setNdefMessage([]);
      }
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setNfcRequestInProgress(false);
    }
  };

  const sendPostRequest = (message) => {
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
        setMessage(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const displayMessage = (payload) => {
    const message = payload[0]?.payload.toLowerCase();
    sendPostRequest(message);
    setIsScanning(false); // Stop scanning after displaying the message
  };

  const scanNfcTag = () => {
    setIsScanning(true);
    setMessage('');
    setNdefMessage([]);
    readNdef();
  };

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.scanningContainer}>
          <Text style={styles.scanningText}>Approach an NFC Tag</Text>
          <Icon name="nfc-search-variant" size={50} color="#ffffff" style={styles.scanningIcon} />
        </View>
      ) : (
        <>
          {message ? (
            <>
              <Text style={styles.message}>{message}</Text>
              <TouchableOpacity onPress={scanNfcTag} style={styles.button}>
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={scanNfcTag} style={styles.button}>
              <Text style={styles.buttonText}>Scan NFC Tag</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  scanningIcon: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default NFCReaderScreen;
