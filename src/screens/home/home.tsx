// home.tsx
import React, { useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl, // Import Alert for confirmation dialog
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  deletePlantRequest,
  fetchPlantsRequest,
} from '../../redux/actions/plantAction';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../theme/commonStyle';
import { Plant } from '../../redux/types/plantType';
import {
  responsiveFontSize,
  scale,
  verticalScale,
} from '../../utills/scallingUtills';
import PlantActionMenu from '../../components/plantPopupMenu';
import { FONTS } from '../../constant/Fonts';
import { COLORS } from '../../theme/color';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { plants, loading, error } = useSelector(
    (state: any) => state.plantState,
  ); // Corrected: Access plantState
  console.log('plants', JSON.stringify(plants)); // This will help you see if 'plants' array is empty or has data
  console.log('loading', loading); // Check if any errors are logged here
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

  const handleRefresh = () => {
    dispatch(fetchPlantsRequest());
  };
  const renderPlantItem = ({ item }: { item: Plant }) => (
    <View style={styles.plantCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <PlantActionMenu
          onView={() => handleViewPlant(item)}
          onEdit={() => handleEditPlant(item)}
          onDelete={() => handleDeletePlant(item._id ?? '', item.name)}
        />
      </View>
      {item.scientificName && (
        <Text style={styles.cardScientificName}>{item.scientificName}</Text>
      )}
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
        <TouchableOpacity
          style={styles.actionAddPlantButton}
          onPress={() => navigation.navigate('Plant', { plant: null })}
        >
          <Text style={styles.actionButtonText}>Add Plant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionAddPlantButton}
          onPress={() => navigation.navigate('PlantList')}
        >
          <Text style={styles.actionButtonText}>Plant List</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color={COLORS.TEXT_COLOR} />}
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
          renderItem={renderPlantItem}
          contentContainerStyle={styles.listContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[COLORS.TEXT_COLOR]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: COLORS.MAIN_BG_COLOR,
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
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
  },
  profileButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
  },
  profileButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(1.5),
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  actionAddPlantButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  listContentContainer: {
    paddingBottom: verticalScale(20),
  },
  plantCard: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: scale(10),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: COLORS.SHADOW_COLOR_1,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_EXTRABOLD,
  },
  cardScientificName: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.TEXT_COLOR_2,
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

  actionButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(1.5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  emptyText: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(12),
  },
  emptySubtext: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_3,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: verticalScale(22),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_COLOR_3,
  },
});
