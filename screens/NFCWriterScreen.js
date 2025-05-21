import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from 'react-native';

function NFCWriterScreen() {
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [devicePort, setDevicePort] = useState('');
  const [deviceAction, setDeviceAction] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    NfcManager.start();
    retrieveDevices();
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  const writeNdef = async (payload) => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      setIsWriting(true);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(payload)]);
      await NfcManager.writeNdefMessage(bytes);
      Alert.alert('Tag written successfully!');
    } catch (ex) {
      console.warn('Oops!', ex);
      Alert.alert('Error writing to tag. Please try again.');
    } finally {
      setIsWriting(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const handleWriteDevice = (port, action) => {
    const payload = action + ' ' + port;
    writeNdef(payload);
    setIsWriting(true);
  };

  const handleAddDevice = () => {
    setModalVisible(true);
  };

  const handleSaveDevice = async () => {
    if (deviceName && devicePort && deviceAction) {
      const newDevice = {
        name: deviceName,
        port: devicePort,
        action: deviceAction,
      };
      const updatedDevices = [...devices, newDevice];
      setDevices(updatedDevices);
      setModalVisible(false);
      setDeviceName('');
      setDevicePort('');
      setDeviceAction('');
      await storeDevices(updatedDevices);
    } else {
      Alert.alert('Please fill in all the fields.');
    }
  };

  const handleRemoveDevice = async (index) => {
    const updatedDevices = [...devices];
    updatedDevices.splice(index, 1);
    setDevices(updatedDevices);
    await storeDevices(updatedDevices);
  };

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

  const handlePress = (index) => {
    setSelectedIndex(index);
    handleWriteDevice(item.port, item.action);
  };

  const storeDevices = async (devices) => {
    try {
      await AsyncStorage.setItem('devices', JSON.stringify(devices));
    } catch (error) {
      console.error('Error storing devices:', error);
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const renderDeviceItem = ({ item, index }) => {
    const handlePress = (index) => {
      setSelectedIndex(index);
      handleWriteDevice(item.port, item.action);
    };

    return (
      <TouchableHighlight
        onPress={() => handlePress(index)}
        underlayColor="#fff" // Set the background color when pressed
        style={[
          styles.deviceContainer,
          isWriting && index === selectedIndex && styles.deviceContainerPressed,
        ]}
      >
        <View>
          <Text
            style={[
              styles.deviceName,
              isWriting && index === selectedIndex && styles.deviceNamePressed,
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.deviceInfo,
              isWriting && index === selectedIndex && styles.deviceInfoPressed,
            ]}
          >
            Port: {item.port} | Action: {item.action}
          </Text>
          <TouchableOpacity
            onPress={() => handleRemoveDevice(index)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddDevice} style={styles.addButton}>
          <Image
            source={require('./home-plus.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Add Device</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Devices List:</Text>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.listContainer}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Device</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={deviceName}
              onChangeText={(text) => setDeviceName(text)}
              placeholderTextColor="#ffffff"
            />
            <Picker
              selectedValue={devicePort}
              onValueChange={(itemValue) => setDevicePort(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              prompt="Select Device Port"
            >
              <Picker.Item label="Select Port" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
            </Picker>
            <Picker
              selectedValue={deviceAction}
              onValueChange={(itemValue) => setDeviceAction(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              prompt="Select Device Action"
            >
              <Picker.Item label="Select Action" value="" />
              <Picker.Item label="On" value="on" />
              <Picker.Item label="Off" value="off" />
              <Picker.Item label="Blink" value="blink" />
              <Picker.Item label="Toggle" value="toggle" />
            </Picker>
            <TouchableOpacity
              onPress={handleSaveDevice}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  deviceContainerPressed: {
    backgroundColor: '#fff',
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
  deviceNamePressed: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceInfoPressed: {
    color: '#000',
    fontSize: 14,
  },
  removeButton: {
    alignSelf: 'flex-end',
    color: 'red'
  },
  removeButtonText: {
    color: 'red',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#ffffff',
  },
  picker: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    color: '#ffffff',
  },
  pickerItem: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#C060A1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NFCWriterScreen;