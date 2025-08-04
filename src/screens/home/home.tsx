// home.tsx
import React, { useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert, // Import Alert for confirmation dialog
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  deletePlantRequest,
  fetchPlantsRequest,
} from '../../redux/actions/plantAction';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../theme/commonStyle'; // Assuming this exists
import { SVG } from '../../constant/svg'; // Assuming this exists for icons
import { SvgXml } from 'react-native-svg';
import { Plant } from '../../redux/types/plantType'; // Import Plant type for better type safety
import { responsiveFontSize, responsiveWidth, scale, verticalScale } from '../../utills/scallingUtills';

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

  const handleDeletePlant = (plantId: string, plantName: string) => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete "${plantName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deletePlantRequest(plantId));
          },
        },
      ],
    );
  };

  const handleViewPlant = (plant: Plant) => {
    if (plant._id) {
      // Ensure plant._id is not undefined
      navigation.navigate('PlantDetail', { plantId: plant._id });
    } else {
      Alert.alert('Error', 'Plant ID is missing. Cannot view details.');
    }
  };

  const handleEditPlant = (plant: Plant) => {
    if (plant._id) {
      navigation.navigate('Plant', { plant: plant });
    } else {
      Alert.alert('Error', 'Plant ID is missing. Cannot edit plant.');
    }
  };

  const renderPlantItem = ({ item }: { item: Plant }) => (
    <View style={styles.plantCard}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.scientificName && (
        <Text style={styles.cardScientificName}>{item.scientificName}</Text>
      )}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewPlant(item)}
        >
          <SvgXml xml={SVG.SHOW_PASSWORD} width="20" height="20" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditPlant(item)}
        >
          <SvgXml xml={SVG.EDIT} width="20" height="20" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => item._id && handleDeletePlant(item._id, item.name)}
        >
          <SvgXml xml={SVG.DELETE} width="20" height="20" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <View style={styles.topButtonsContainer}>
        {' '}
        {/* Changed name to avoid conflict */}
        <TouchableOpacity
          style={styles.actionAddPlantButton} // Specific style for Add Plant
          onPress={() => navigation.navigate('Plant', { plant: null })}
        >
          <Text style={styles.actionButtonText}>Add New Plant</Text>
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
          keyExtractor={(item) => item._id || item.name} // Ensure unique key
          renderItem={renderPlantItem}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: '#e8f5e9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: '#c8e6c9',
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  profileButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveFontSize(1.5),
  },
  topButtonsContainer: {
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  actionAddPlantButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    width: responsiveWidth(80),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  listContentContainer: {
    paddingBottom: verticalScale(20),
  },
  plantCard: {
    backgroundColor: '#ffffff',
    borderRadius: scale(10),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#c8e6c9',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: verticalScale(4),
  },
  cardScientificName: {
    fontSize: responsiveFontSize(1.7),
    color: '#555',
    marginBottom: verticalScale(12),
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(6),
    flex: 1,
    marginHorizontal: scale(4),
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#f39c12',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: verticalScale(10),
  },
  emptySubtext: {
    fontSize: responsiveFontSize(1.8),
    color: '#95a5a6',
    textAlign: 'center',
  },
});