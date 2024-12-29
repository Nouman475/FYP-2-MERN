import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useAuth } from "../context/authContext";

const AddEventScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    visibility: "Public",
  });
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateDate = (dateString) => {
    // Check if the date matches YYYY-MM-DD format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateString)) return false;

    // Check if the date is valid
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
  };

  const handleSubmit = async () => {
    setUploading(true);

    // Validate date
    if (!validateDate(formData.date)) {
      Alert.alert(
        "Invalid Date", 
        "Please enter a valid date in YYYY-MM-DD format (e.g., 2024-12-31)"
      );
      setUploading(false);
      return;
    }

    try {
      const response = await axios.post("https://raw-backend47.vercel.app/api/v2/addEvent", {
        email: user.email,
        ...formData,
      });

      Alert.alert("Success", "Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        visibility: "Public",
      });
    } catch (error) {
      console.error("Add Event Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create event.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => handleInputChange("title", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange("description", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={formData.date}
        onChangeText={(text) => handleInputChange("date", text)}
        maxLength={10}
      />
      <Text style={styles.helperText}>
        Enter date in format: YYYY-MM-DD (e.g., 2024-12-31)
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => handleInputChange("location", text)}
      />

      <Text>Select Category</Text>
      <Picker
        selectedValue={formData.category}
        onValueChange={(value) => handleInputChange("category", value)}
        style={styles.picker}
      >
        <Picker.Item label="Tech" value="Tech" />
        <Picker.Item label="Music" value="Music" />
        <Picker.Item label="Sports" value="Sports" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text>Select Visibility</Text>
      <Picker
        selectedValue={formData.visibility}
        onValueChange={(value) => handleInputChange("visibility", value)}
        style={styles.picker}
      >
        <Picker.Item label="Public" value="Public" />
        <Picker.Item label="Private" value="Private" />
      </Picker>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: "center" 
  },
  input: { 
    borderWidth: 1, 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 5 
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 10,
    paddingLeft: 2
  },
  picker: { 
    borderWidth: 1, 
    marginBottom: 10 
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    textAlign: "center" 
  },
});

export default AddEventScreen;