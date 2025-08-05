import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import AuthInitializer from './src/components/AuthInitializer';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <MenuProvider>
          <AuthInitializer>
            <AppNavigator />
          </AuthInitializer>
        </MenuProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
