// home.tsx
import React, { useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  deletePlantRequest,
  fetchPlantsRequest,
} from '../../redux/actions/plantAction';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { plants, loading, error } = useSelector(
    (state: any) => state.plantState,
  ); // Corrected: Access plantState
  console.log('plants', JSON.stringify(plants));
  console.log('error', JSON.stringify(error));
  useEffect(() => {
    dispatch(fetchPlantsRequest());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AR Plant Identifier</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Add Plant"
        onPress={() => navigation.navigate('AddPlant', { plant: null })}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={plants}
        keyExtractor={item => item._id || item.name}
        renderItem={({ item }) => (
          <View
            style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>Care Tips: {item.careTips}</Text>
            <Text>Toxicity: {item.toxicity}</Text>
            <Button
              title="Delete"
              color="red"
              onPress={() => dispatch(deletePlantRequest(item._id))}
            />
            <Button
              title="Edit"
              onPress={() => navigation.navigate('AddPlant', { plant: item })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
