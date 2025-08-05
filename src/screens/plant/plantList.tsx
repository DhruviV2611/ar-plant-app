import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  fetchPlantsRequest,
  deletePlantRequest,
} from '../../redux/actions/plantAction';
import { Plant } from '../../redux/types/plantType';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import PlantActionMenu from '../../components/plantPopupMenu';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';

export default function PlantListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { plants, loading, error } = useSelector(
    (state: any) => state.plantState,
  );
  console.log('plants-->', plants);
  const isAuthenticated = useSelector(
    (state: any) => state?.auth?.isAuthenticated,
  );
  console.log('isAuthenticated:', isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPlantsRequest());
    } else {
      console.log('User not authenticated, skipping fetchPlantsRequest.');
    }
  }, [dispatch, isAuthenticated]);

  const handleRefresh = () => {
    dispatch(fetchPlantsRequest());
  };

  const handleViewPlant = (plant: Plant) => {
    (navigation as any).navigate('PlantDetail', { plantId: plant._id });
  };

  const handleEditPlant = (plant: Plant) => {
    (navigation as any).navigate('Plant', { plant });
  };

  const handleDeletePlant = (plant: Plant) => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete "${plant.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (plant._id) {
              dispatch(deletePlantRequest(plant._id));
            }
          },
        },
      ],
    );
  };

  const handleAddPlant = () => {
    (navigation as any).navigate('Plant', { plant: null });
  };

  const handleIdentifyPlant = () => {
    (navigation as any).navigate('PlantIdentification');
  };

  const renderPlantItem = ({ item }: { item: Plant }) => (
    <View style={styles.plantCard}>
      <View style={styles.plantInfo}>
          <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              
        
            <PlantActionMenu
              onView={() => handleViewPlant(item)}
              onEdit={() => handleEditPlant(item)}
              onDelete={() => handleDeletePlant(item)}
            />
          </View>
        {item.scientificName && (
          <Text style={styles.scientificName}>{item.scientificName}</Text>
        )}
        {item.careTips?.light && (
          <Text style={styles.careTip}>Light: {item.careTips.light}</Text>
        )}
        {item.toxicity?.severity && (
          <Text
            style={[
              styles.toxicity,
              { color: getToxicityColor(item.toxicity.severity) },
            ]}
          >
            Toxicity: {item.toxicity.severity}
          </Text>
        )}
        {item.journalEntries && item.journalEntries.length > 0 && (
          <Text style={styles.journalCount}>
            {item.journalEntries.length} journal entr
            {item.journalEntries.length === 1 ? 'y' : 'ies'}
          </Text>
        )}
      </View>

    </View>
  );

  const getToxicityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#7f8c8d';
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plants</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddPlant}
          >
            <Text style={styles.headerButtonText}>Add Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleIdentifyPlant}
          >
            <Text style={styles.headerButtonText}>Identify</Text>
          </TouchableOpacity>
        </View>
      </View>

      {plants.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plants found</Text>
          <Text style={styles.emptySubtext}>
            Add your first plant or identify one using the camera!
          </Text>
          <View style={styles.emptyButtons}>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddPlant}
            >
              <Text style={styles.emptyButtonText}>Add Plant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleIdentifyPlant}
            >
              <Text style={styles.emptyButtonText}>Identify Plant</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={plants}
          renderItem={renderPlantItem}
          keyExtractor={item => item._id || item.name}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
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
    backgroundColor: COLORS.HEADER_BG_COLOR,
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(4),
    marginLeft: scale(8),
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  listContainer: {
    padding: scale(16),
  },
  plantCard: {
    backgroundColor: 'white',
    borderRadius: scale(8),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#c8e6c9',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  plantInfo: {
    marginBottom: verticalScale(12),
  },
  plantName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: verticalScale(4),
  },
  scientificName: {
    fontSize: responsiveFontSize(1.7),
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: verticalScale(8),
  },
  careTip: {
    fontSize: responsiveFontSize(1.7),
    color: '#34495e',
    marginBottom: verticalScale(4),
  },
  toxicity: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  journalCount: {
    fontSize: responsiveFontSize(1.5),
    color: '#27ae60',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: verticalScale(8),
  },
    cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Or 'center' if you prefer
  },
    cardTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: verticalScale(4),
  },
  emptySubtext: {
    fontSize: responsiveFontSize(2),
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  emptyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  emptyButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
});

