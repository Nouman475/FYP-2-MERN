import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EventListScreen from '../screens/editScreen';


const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <HomeStack.Screen
        name="Event"
        component={EventListScreen}
        options={{
          title: 'Event',
          headerStyle: {
            backgroundColor: '#FFDAB9',
          },
          headerTintColor: '#000',
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;