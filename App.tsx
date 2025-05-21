import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { Image, Text, View } from 'react-native';

// Screens imports
import WelcomeScreen from './screens/WelcomeScreen.js';
import NFCReaderScreen from './screens/NFCReaderScreen.js';
import NFCWriterScreen from './screens/NFCWriterScreen.js';
import AboutScreen from './screens/AboutScreen.js';
import RemoteOverlayScreen from './screens/RemoteOverlay.js';


const Tab = createBottomTabNavigator();
const AppLogo = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('./screens/assets/logo_new.png')}
      style={{ width: 24, height: 24, marginRight: 8 }}
    />
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>NFC App</Text>
  </View>
  );

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          headerTitle: () => <AppLogo />,
          headerStyle: {
            backgroundColor: '#222831',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            backgroundColor: 'black',
            display: 'flex',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Scan') {
              iconName = focused ? 'scan' : 'scan-outline';
            } else if (route.name === 'Devices') {
              iconName = focused ? 'options' : 'options-outline';
            } else if (route.name === 'Manual') {
              iconName = focused ? 'flash' : 'flash-outline'  ;
            }
              else if (route.name === 'About') {
              iconName = focused ? 'person' : 'person-outline'  ;
            }
            
              return <Icon  name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={WelcomeScreen} />
        <Tab.Screen name="Scan" component={NFCReaderScreen} />
        <Tab.Screen name="Devices" component={NFCWriterScreen} />
        <Tab.Screen name="Manual" component={RemoteOverlayScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;