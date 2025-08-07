
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import store, { persistor } from './src/redux/store';
import AppNavigator from './src/navigation';
import AuthInitializer from './src/components/AuthInitializer';
import ThemeProvider from './src/theme/ThemeProvider';
import NotificationBanner from './src/components/NotificationBanner';
import { toastConfig } from './src/config/toastConfig';

export default function App() {


  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MenuProvider>
            <AuthInitializer>
                <ThemeProvider>
                  <AppNavigator />
                  <NotificationBanner />
                  <Toast config={toastConfig} />
                </ThemeProvider>
            </AuthInitializer>
          </MenuProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
