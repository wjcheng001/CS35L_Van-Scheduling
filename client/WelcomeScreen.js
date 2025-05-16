import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  const handleGuestMode = () => {
    // For now, just navigate to Dashboard
    navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          AI Meal Randomizer
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Generate perfect meals from your ingredients
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Auth')}
          style={styles.button}
        >
          Sign Up
        </Button>
        <Button
          mode="outlined"
          onPress={handleGuestMode}
          style={styles.button}
        >
          Continue as Guest
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  button: {
    marginVertical: 8,
  },
}); 