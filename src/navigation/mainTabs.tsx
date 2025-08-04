// navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg'; // Make sure this is imported

// Screens
import HomeScreen from '../screens/home/home';
import PlantListScreen from '../screens/plant/plantList';
import ProfileScreen from '../screens/profile/profile';
import { SVG } from '../constant/svg';

// Your SVG constants


const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let icon = SVG.HOME;

          if (route.name === 'Home') icon = SVG.HOME;
          else if (route.name === 'Plants') icon = SVG.PLANT;
          else if (route.name === 'Profile') icon = SVG.PROFILE;

          return <SvgXml xml={icon} width={size} height={size} fill={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plants" component={PlantListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
