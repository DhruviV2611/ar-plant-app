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
import { commonStyles } from '../../theme/commonStyle';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { plants, loading, error } = useSelector(
    (state: any) => state.plantState,
  ); // Corrected: Access plantState
  console.log('plants', JSON.stringify(plants)); // This will help you see if 'plants' array is empty or has data
  console.log('error', JSON.stringify(error)); // Check if any errors are logged here
  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.isAuthenticated,
  );
  console.log('isAuthenticated:', isAuthenticated); // Check if the user is authenticated

useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchPlantsRequest());
  } else {
    console.log('User not authenticated, skipping fetchPlantsRequest.');
  }
}, [dispatch, isAuthenticated]);

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
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Plant', { plant: null })}
      >
        <Text style={styles.profileButtonText}>Add Plant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('PlantList')}
      >
        <Text style={styles.profileButtonText}>Plant List</Text>
      </TouchableOpacity>
    </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={commonStyles.errorText}>Error: {error}</Text>}
      {!loading && !error && plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plants found!</Text>
          <Text style={styles.emptySubtext}>
            Add your first plant to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={item => item._id || item.name}
          renderItem={({ item }) => (
            <View
              style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              {/* FIX: Access specific properties of careTips and toxicity */}
              {item.careTips && (
                <Text>
                  Care Tips: Light: {item.careTips.light || 'N/A'}, Water:{' '}
                  {item.careTips.water || 'N/A'}
                  {/* Add more care tips properties as needed */}
                </Text>
              )}
              {item.toxicity && (
                <Text>
                  Toxicity: Severity: {item.toxicity.severity || 'N/A'}, To
                  Cats: {item.toxicity.isToxicToCats ? 'Yes' : 'No'}
                  {/* Add more toxicity properties as needed */}
                </Text>
              )}
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
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
