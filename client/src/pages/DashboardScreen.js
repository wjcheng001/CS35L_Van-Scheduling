import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, IconButton, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const TimeCard = ({ title, onPress }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content>
      <Text variant="titleLarge">{title}</Text>
      <Text variant="bodyMedium">Tap to find a van schedule</Text>
    </Card.Content>
    <Card.Actions>
      <IconButton icon="plus" onPress={onPress} />
    </Card.Actions>
  </Card>
);

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => {/* TODO: Navigate to settings */}}
        />
      </View>

      <ScrollView style={styles.content}>
        <TimeCard 
          title="Morning"
          onPress={() => {/* TODO: Navigate to scheduling */}}
        />
        <TimeCard 
          title="Afternoon"
          onPress={() => {/* TODO: Navigate to scheduling */}}
        />
        <TimeCard 
          title="Evening"
          onPress={() => {/* TODO: Navigate to scheduling */}}
        />
        <TimeCard 
          title="Night"
          onPress={() => {/* TODO: Navigate to scheduling */}}
        />
      </ScrollView>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => {}}
        label="Restart"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 
