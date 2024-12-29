import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/authContext';

const RegisterScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {setIsAuthenticated, setUser} = useAuth();

  // Validation functions
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(email).toLowerCase())) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = password => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!re.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long with a mix of uppercase, lowercase, and numbers',
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://raw-backend47.vercel.app/api/v1/register',
        {
          fullName,
          email,
          password,
        },
      );

      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      Alert.alert('Success', `Welcome, ${fullName}!`);
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      if (error.response) {
        Alert.alert(
          'Error',
          error.response.data.message || 'An unexpected error occurred',
        );
      } else {
        Alert.alert('Error', 'Error connecting to server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://res.cloudinary.com/da9ezk2tb/image/upload/v1735468697/WhatsApp_Image_2024-12-29_at_3.00.22_PM_ip9mfg.jpg',
      }}
      style={styles.background}>
      <ScrollView contentContainerStyle={styles.overlay}>

        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={email}
              onChangeText={text => {
                setEmail(text);
                validateEmail(text);
              }}
            />
            {emailError ? (
              <Text style={styles.helperText}>{emailError}</Text>
            ) : null}
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={text => {
                setPassword(text);
                validatePassword(text);
              }}
            />
            {passwordError ? (
              <Text style={styles.helperText}>{passwordError}</Text>
            ) : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>{isLoading && <ActivityIndicator/>}Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText2}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  bottomContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#f5f4eb',
    textAlign: 'center',
  },
  para: {
    fontSize: 16,
    color: '#f5f4eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  helperText: {
    fontSize: 12,
    color: 'red',
    marginTop: -5, // Adjust spacing to reduce extra margin
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#7132a8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    fontSize: 18,
    color: '#f5f4eb',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 20,
  },
});

export default RegisterScreen;
