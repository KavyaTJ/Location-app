import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/Home';
import MapViewLoc from './src/MapView';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {
          height: 60,
          width: '90%',
          backgroundColor: '#7fa99b',
          borderBottomWidth: 0.5,
          borderRightWidth: 0.5,
          borderLeftWidth: 0.5,
          borderColor: 'white',
          position: 'absolute',
          borderRadius: 30,
          bottom: 5,
          left: 20,
          elevation: 0,
        }}}
      >
        <Tab.Screen name="Location" component={Home}  options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="location" color={color} size={size} />
      ),
    }} />
        <Tab.Screen name="Map" component={MapViewLoc}  options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="map" color={color} size={size} />
      ),
    }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
