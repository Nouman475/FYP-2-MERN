import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  useTheme,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
  },
};

const SliderScreen = ({ onComplete }) => {
  const { colors } = useTheme();
  const SLIDES = [
    {
      id: '1',
      title: 'Never miss an event',
      description: 'Explore amazing features.',
      image: "https://images.bzyjr9ji.ext.evbdomains.com/marketing/landingpages/assets/2023/organizer/a_organizer_event--creator-eventbrite-.webp",
    },
    {
      id: '2',
      title: 'Manage everything',
      description: 'Monitor your activities easily.',
      image: "https://cdni.iconscout.com/illustration/premium/thumb/girl-climbing-on-growth-chart-for-achieving-goal-illustration-download-in-svg-png-gif-file-formats--analytics-logo-career-success-progress-report-pack-business-illustrations-9551318.png?f=webp",
    },
    {
      id: '3',
      title: 'Stay Connected',
      description: 'Keep in touch with your network.',
      image: "https://images.bzyjr9ji.ext.evbdomains.com/marketing/landingpages/assets/2023/organizer/a_organizer_event--creator-eventbrite-.webp",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenSlider', 'true');
    onComplete();
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Surface style={styles.imageSurface}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </Surface>
      <Text style={styles.title} variant="headlineLarge">
        {item.title}
      </Text>
      <Text style={styles.description} variant="bodyLarge">
        {item.description}
      </Text>
    </View>
  );
  

  const Pagination = () => (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              width: currentIndex === index ? 20 : 8,
              backgroundColor: currentIndex === index ? colors.primary : colors.primary + '50',
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentIndex(newIndex);
          }}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        <Pagination />

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageSurface: {
    elevation: 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    resizeMode: 'cover',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 130,
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default SliderScreen;