import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const EventsListScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    visibility: 'Public',
  });
  const [updating, setUpdating] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://raw-backend47.vercel.app/api/v2/getEvents');
      setEvents(response.data.events);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      category: event.category,
      visibility: event.visibility,
    });
    setModalVisible(true);
  };

  const handleDelete = async (eventId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`https://raw-backend47.vercel.app/api/v2/deleteEvent/${eventId}`);
              setEvents(events.filter(event => event._id !== eventId));
              Alert.alert('Success', 'Event deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          }
        }
      ]
    );
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(
        `https://raw-backend47.vercel.app/api/v2/updateEvent/${selectedEvent._id}`,
        editFormData
      );
      
      setEvents(events.map(event => 
        event._id === selectedEvent._id ? { ...event, ...editFormData } : event
      ));
      
      setModalVisible(false);
      Alert.alert('Success', 'Event updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update event');
    } finally {
      setUpdating(false);
    }
  };

  const validateForm = () => {
    if (!editFormData.title || !editFormData.date || !editFormData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {events.map((event) => (
          <View key={event._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.dateText}>{formatDate(event.date)}</Text>
            </View>
            
            <Text style={styles.descriptionText}>{event.description}</Text>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>📍 {event.location}</Text>
              <Text style={styles.detailText}>🏷️ {event.category}</Text>
              <Text style={styles.detailText}>
                👁️ {event.visibility}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(event)}
              >
              <Text style={styles.buttonText}><Icon name="create-outline" size={16} color="white" /></Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(event._id)}
              >
                <Text style={styles.buttonText}><Icon name="trash-outline" size={16} color="white" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editFormData.title}
              onChangeText={(text) => setEditFormData({...editFormData, title: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editFormData.description}
              onChangeText={(text) => setEditFormData({...editFormData, description: text})}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={editFormData.date}
              onChangeText={(text) => setEditFormData({...editFormData, date: text})}
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder="Location"
              value={editFormData.location}
              onChangeText={(text) => setEditFormData({...editFormData, location: text})}
            />

            <Text style={styles.pickerLabel}>Category</Text>
            <Picker
              selectedValue={editFormData.category}
              onValueChange={(value) => setEditFormData({...editFormData, category: value})}
              style={styles.picker}
            >
              <Picker.Item label="Tech" value="Tech" />
              <Picker.Item label="Music" value="Music" />
              <Picker.Item label="Sports" value="Sports" />
              <Picker.Item label="Other" value="Other" />
            </Picker>

            <Text style={styles.pickerLabel}>Visibility</Text>
            <Picker
              selectedValue={editFormData.visibility}
              onValueChange={(value) => setEditFormData({...editFormData, visibility: value})}
              style={styles.picker}
            >
              <Picker.Item label="Public" value="Public" />
              <Picker.Item label="Private" value="Private" />
            </Picker>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdate}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  descriptionText: {
    color: '#444',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  detailText: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    borderRadius: 40,
    marginLeft: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#148396', // Turquoise blue
  },
  deleteButton: {
    backgroundColor: '#148396', // Turquoise blue
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerLabel: {
    marginTop: 5,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
});

export default EventsListScreen;