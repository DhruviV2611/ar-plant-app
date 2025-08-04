import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

// Auth Screens
import LoginScreen from '../screens/login/login';
import RegisterScreen from '../screens/login/register';

// App Screens
import MainTabs from './mainTabs';
import PlantScreen from '../screens/plant/plant';
import PlantDetailScreen from '../screens/plant/plantDetail';
import PlantIdentificationScreen from '../screens/plant/plantIdentification';
import JournalDetailScreen from '../screens/journal/journalDetail';
import JournalAddScreen from '../screens/journal/journalAdd';
import JournalEditScreen from '../screens/journal/journalEdit';
import PlantListScreen from '../screens/plant/plantList';
import JournalListScreen from '../screens/journal/journalList';

export default function AppNavigator() {
  const Stack = createNativeStackNavigator();
  const { token } = useSelector((state: AppState) => state.authState);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'MainTabs' : 'Login'}
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
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Plant"
              component={PlantScreen}
              options={({ route }: any) => ({
                title: route.params?.plant ? 'Edit Plant' : 'Add Plant',
              })}
            />
            <Stack.Screen
              name="PlantList"
              component={PlantListScreen}
              options={{ title: 'Plant List' }}
            />
            <Stack.Screen
              name="PlantDetail"
              component={PlantDetailScreen}
              options={{ title: 'Plant Details' }}
            />
            <Stack.Screen
              name="PlantIdentification"
              component={PlantIdentificationScreen}
              options={{ title: 'Identify Plant' }}
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
            <Stack.Screen
              name="JournalList"
              component={JournalListScreen}
              options={{ title: 'Journal List' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Sign In', headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Sign Up', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
