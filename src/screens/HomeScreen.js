
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MyComponent from './components/table';
import { ScrollView } from 'react-native-gesture-handler';
import EventsListScreen from './editScreen';
import EventsCardList from './components/events';



// Dimensions
const {width} = Dimensions.get('window');

// Sample Campaign Data
const campaignData = [
  {
    id: '1',
    title: 'Govt school opening',
    description: 'Support education in underserved communities',
    raised: 200,
    goal: 500,
    image:
      'https://images.ctfassets.net/p0qf7j048i0q/E3C718B6580F40C3B5C7D8D1E86B4A6E/f3dbff6e10f35df96a79d58b6039b954/i499343530.jpg?w=3840&q=75&h=3840&fm=webp', // Replace with actual image
  },
  {
    id: '2',
    title: 'Medical Camp',
    description: 'Provide essential healthcare support',
    raised: 300,
    goal: 200,
    image:
      'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg', // Replace with actual image
  },
  {
    id: '3',
    title: 'Night party',
    description: 'Full enjoyment and joy.',
    raised: 50,
    goal: 100,
    image:
      'https://interwood.pk/cdn/shop/products/taylar--2--3c02bc4-interwood-mobel.jpg?v=1695756521', // Replace with actual image
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollX = useRef(new Animated.Value(0)).current;

  // Filters
  const filters = ['All', 'Educational', 'Healthcare', 'Community','Parties','miscelleneous'];

  // Carousel Rendering
  const renderCampaignCard = ({item, index}) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    return (
      <Animated.View
        style={[
          styles.campaignCard,
          {
            opacity,
            transform: [{scale}],
            width: width - 40,
          },
        ]}>
        <View style={styles.cardImageContainer}>
          <Animated.Image
            src={item.image}
            style={styles.cardImage}
            blurRadius={2}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(item.raised / item.goal) * 100}%`,
                  backgroundColor: '#32a8a6',
                },
              ]}
            />
          </View>

          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Arrived: {item.raised}</Text>
            <Text style={styles.progressText}>RSPV: {item.goal}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#32a8a6"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search campaigns"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Event')} style={styles.notificationIcon}>
          <MIcon name="event" size={24} color="#32a8a6" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterButton,
                activeFilter === item && styles.activeFilterButton,
              ]}>
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === item && styles.activeFilterButtonText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      </View>

      {/* Campaigns Carousel */}
      <FlatList
        data={campaignData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        renderItem={renderCampaignCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.carouselContainer}
      />
      <EventsCardList/>
      <Text style={styles.dataTitle}>Events We <Text style={styles.themeColor}>Got</Text></Text>
      <MyComponent/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop:15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: '#32a8a6',
  },
  filterButtonText: {
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  carouselContainer: {
    paddingHorizontal: 10,
  },
  campaignCard: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    height: 200,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 10,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#666',
    fontSize: 12,
  },
  dataTitle :{
    fontSize:24,
    fontWeight:"bold",
    textAlign:"center",
  },
 themeColor:{
  color:"#32a8a6"
 }
});

export default HomeScreen;
