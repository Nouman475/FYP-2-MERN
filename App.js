import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigator/AppNavigator';

import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {AuthProvider, useAuth} from './src/context/authContext';
import AuthRoutes from './src/screens/auth/authRoutes';

import {CartProvider} from './src/context/cartContext';
import {WishlistProvider} from './src/context/wishlistContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SliderScreen from './src/screens/SliderScreen';

const AppContent = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const [hasSeenSlider, setHasSeenSlider] = useState(false);
  const [isCheckingSlider, setIsCheckingSlider] = useState(true);

  useEffect(() => {
    const checkSlider = async () => {
      const seenSlider = await AsyncStorage.getItem('hasSeenSlider');
      setHasSeenSlider(!!seenSlider);
      setIsCheckingSlider(false);
    };

    checkSlider();
  }, []);

  if (isLoading || isCheckingSlider) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!hasSeenSlider) {
    return <SliderScreen onComplete={() => setHasSeenSlider(true)} />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthRoutes />;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <PaperProvider>
              <AppContent />
            </PaperProvider>
          </GestureHandlerRootView>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

// Add styles for the loading spinner
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
