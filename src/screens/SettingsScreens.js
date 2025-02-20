import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../context/authContext';
import {Switch} from 'react-native-paper';

const SettingsScreen = () => {
  // State for toggle switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);

  const {user, logout} = useAuth();

  // User profile mock data
  const userProfile = {
    avatar:
      'https://cdn3.iconfinder.com/data/icons/avatar-set/512/Avatar13-512.png',
  };

  // Setting item component
  const SettingItem = ({icon, title, subtitle, onPress, rightComponent}) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={22} color="#32a8a6" />
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{uri: userProfile.avatar}} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.fullName}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.settingsContainer}
        showsVerticalScrollIndicator={false}>
        {/* Notification Settings */}
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage app notifications"
          rightComponent={
            <Switch
              color="#32a8a6"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          }
        />

        {/* Appearance Settings */}
        <SettingItem
          icon="color-palette-outline"
          title="Dark Mode"
          subtitle="Switch between light and dark theme"
          rightComponent={
            <Switch
              color="#32a8a6"
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          }
        />

        {/* Privacy Settings */}
        <SettingItem
          icon="lock-closed-outline"
          title="Privacy Mode"
          subtitle="Hide sensitive note contents"
          rightComponent={
            <Switch
              color="#32a8a6"
              value={privacyModeEnabled}
              onValueChange={setPrivacyModeEnabled}
            />
          }
        />

        {/* Account Management Settings */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingGroupTitle}>Account</Text>
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your profile details"
            onPress={() => {
              /* Navigate to Personal Info */
            }}
          />
          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => {
              /* Navigate to Password Change */
            }}
          />
          <SettingItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={logout}
          />
        </View>

        {/* App Settings */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingGroupTitle}>App</Text>
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="App version and information"
            onPress={() => {
              /* Navigate to About */
            }}
          />
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get assistance and contact support"
            onPress={() => {
              /* Navigate to Support */
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    marginRight: 8,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32a8a6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFDAB9',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f0edf2',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    padding: 10,
    borderRadius: 20,
  },
  settingsContainer: {
    flex: 1,
  },
  settingGroup: {
    backgroundColor: 'white',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
});

export default SettingsScreen;
