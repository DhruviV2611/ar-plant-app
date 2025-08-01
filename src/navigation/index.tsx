import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

// Auth Screens
import LoginScreen from '../screens/login/login';
import RegisterScreen from '../screens/login/register';

// App Screens
import HomeScreen from '../screens/home/home';
import PlantScreen from '../screens/plant/plant';
import PlantDetailScreen from '../screens/plant/plantDetail';
import ProfileScreen from '../screens/profile/profile';
import PlantListScreen from '../screens/plant/plantList';
import PlantIdentificationScreen from '../screens/plant/plantIdentification';

// Journal Screens
import JournalListScreen from '../screens/journal/journalList';
import JournalDetailScreen from '../screens/journal/journalDetail';
import JournalAddScreen from '../screens/journal/journalAdd';
import JournalEditScreen from '../screens/journal/journalEdit';

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();
  const { token } = useSelector((state: AppState) => state.authState);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {token ? (
          // Authenticated Stack
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'AR Plant Identifier' }}
            />
            <Stack.Screen
              name="Plant"
              component={PlantScreen}
              options={({ route }: any) => ({ 
                title: route.params?.plant ? 'Edit Plant' : 'Add Plant' 
              })}
            />
            <Stack.Screen
              name="PlantDetail"
              component={PlantDetailScreen}
              options={{ title: 'Plant Details' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
            <Stack.Screen
              name="PlantList"
              component={PlantListScreen}
              options={{ title: 'My Plants' }}
            />
                        <Stack.Screen
              name="PlantIdentification"
              component={PlantIdentificationScreen}
              options={{ title: 'My Plants' }}
            />
            
            {/* Journal Screens */}
            <Stack.Screen
              name="JournalList"
              component={JournalListScreen}
              options={{ title: 'Journal Entries' }}
            />
            <Stack.Screen
              name="JournalDetail"
              component={JournalDetailScreen}
              options={{ title: 'Journal Entry' }}
            />
            <Stack.Screen
              name="JournalAdd"
              component={JournalAddScreen}
              options={{ title: 'Add Journal Entry' }}
            />
            <Stack.Screen
              name="JournalEdit"
              component={JournalEditScreen}
              options={{ title: 'Edit Journal Entry' }}
            />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Sign In',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Sign Up',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
