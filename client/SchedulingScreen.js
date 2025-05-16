import React, { useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Text, FAB, Card, Button } from 'react-native-paper';

export default function SchedulingScreen() {
  const [trips, setTrips] = useState([
    { id: '1', destination: 'Campus Library', time: '10:00 AM' },
    { id: '2', destination: 'Science Building', time: '11:30 AM' },
    { id: '3', destination: 'Gymnasium', time: '1:00 PM' },
  ]);

  const handleAddTrip = () => {
    const newTrip = {
      id: (trips.length + 1).toString(),
      destination: 'New Destination ' + (trips.length + 1),
      time: 'TBD',
    };
    setTrips([...trips, newTrip]);
  };

  const handleTripPress = (trip) => {
    Alert.alert('Trip Details', `Destination: ${trip.destination}\nTime: ${trip.time}`);
  };

  const renderTrip = ({ item }) => (
    <Card style={styles.card} onPress={() => handleTripPress(item)}>
      <Card.Title title={item.destination} subtitle={`Departure: ${item.time}`} />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Trip"
        onPress={handleAddTrip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 12 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
