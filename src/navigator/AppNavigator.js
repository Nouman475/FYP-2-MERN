import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Import screens
import HomeStackNavigator from './stackNavigation';
import SettingsScreen from '../screens/SettingsScreens';
import AddEventScreen from '../screens/addScreen';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            style={styles.tabBar} // Custom styling
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  type: 'NAVIGATE',
                  payload: { name: route.name },
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              return options.tabBarIcon
                ? options.tabBarIcon({ focused, color, size: 25 })
                : null;
            }}

            activeColor="#000"
            inactiveColor="grey"
          />
        )}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="add"
          component={AddEventScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome style={styles.addIcon} name="plus" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = {
  tabBar: {
    height: 65, // Reduced height for a compact appearance
    paddingHorizontal: 0, // Minimal horizontal padding
    paddingVertical: 0, // Minimal vertical padding
    backgroundColor: 'white', // Neutral background
    borderTopWidth: 1, // Add a subtle border
    borderTopColor: '#1d377', // Light gray border color
    elevation: 4, // Slight shadow for depth
  }
};

export default AppNavigator;
