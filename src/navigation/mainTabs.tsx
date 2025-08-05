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
// ✅ Move this OUTSIDE of MainTabs
const getTabIcon =
  (routeName: string) =>
  ({ color, size, focused }: { color: string; size: number; focused: boolean }) => {
    let icon: string | null = null;

    if (routeName === 'Home') {
      icon = focused ? SVG.CHEKED_HOME : SVG.HOME;
    } else if (routeName === 'Plants') {
      icon = focused ? SVG.CHEKED_PLANT : SVG.PLANT;
    } else if (routeName === 'Profile') {
      icon = focused ? SVG.CHEKED_PROFILE : SVG.PROFILE;
    }

    return <SvgXml xml={icon ?? null} width={size} height={size} fill={color} />;
  };

const MainTabs = () => {
  return (
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarLabelStyle: { fontSize: 12 },
    tabBarIcon: getTabIcon(route.name),
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
