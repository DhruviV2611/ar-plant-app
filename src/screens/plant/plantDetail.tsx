import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPlantByIdRequest,
  deletePlantRequest,
} from '../../redux/actions/plantAction';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PlantDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { plantId } = route.params;
  const { selectedPlant, loading, error } = useSelector(
    (state: any) => state.plantState,
  );

  useEffect(() => {
    if (plantId) {
      dispatch(getPlantByIdRequest(plantId));
    }
  }, [plantId, dispatch]);

  const handleEditPlant = () => {
    if (selectedPlant) {
      (navigation as any).navigate('Plant', { plant: selectedPlant });
    }
  };

  const handleDeletePlant = () => {
    if (selectedPlant) {
      Alert.alert(
        'Delete Plant',
        `Are you sure you want to delete "${selectedPlant.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              if (selectedPlant._id) {
                dispatch(deletePlantRequest(selectedPlant._id));
                navigation.goBack();
              }
            },
          },
        ],
      );
    }
  };

  const validatePhotoUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading plant details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getPlantByIdRequest(plantId))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedPlant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with plant image placeholder */}
      <View style={styles.header}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🌱</Text>
        </View>
        <Text style={styles.plantName}>{selectedPlant.name}</Text>
        {selectedPlant.scientificName && (
          <Text style={styles.scientificName}>{selectedPlant.scientificName}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditPlant}
        >
          <Text style={styles.actionButtonText}>Edit Plant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeletePlant}
        >
          <Text style={styles.actionButtonText}>Delete Plant</Text>
        </TouchableOpacity>
      </View>

      {/* Journal Button */}
      <View style={styles.journalButtonContainer}>
        <TouchableOpacity
          style={styles.journalButton}
          onPress={() => (navigation as any).navigate('JournalList', { plantId })}
        >
          <Text style={styles.journalButtonText}>View All Journal Entries</Text>
        </TouchableOpacity>
      </View>

      {/* Care Information */}
      {selectedPlant.careTips && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Information</Text>
          
          {selectedPlant.careTips.light && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Light:</Text>
              <Text style={styles.infoValue}>{selectedPlant.careTips.light}</Text>
            </View>
          )}
          
          {selectedPlant.careTips.water && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Water:</Text>
              <Text style={styles.infoValue}>{selectedPlant.careTips.water}</Text>
            </View>
          )}
          
          {selectedPlant.careTips.temperature && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temperature:</Text>
              <Text style={styles.infoValue}>{selectedPlant.careTips.temperature}</Text>
            </View>
          )}
          
          {selectedPlant.careTips.humidity && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Humidity:</Text>
              <Text style={styles.infoValue}>{selectedPlant.careTips.humidity}</Text>
            </View>
          )}
        </View>
      )}

      {/* Toxicity Information */}
      {selectedPlant.toxicity && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toxicity Information</Text>
          
          {selectedPlant.toxicity.severity && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Severity:</Text>
              <Text
                style={styles.infoValue}>
                {selectedPlant.toxicity.severity}
              </Text>
            </View>
          )}
          
          {selectedPlant.toxicity.symptoms && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Symptoms:</Text>
              <Text style={styles.infoValue}>{selectedPlant.toxicity.symptoms}</Text>
            </View>
          )}
          
          {selectedPlant.toxicity.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.infoValue}>{selectedPlant.toxicity.notes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Journal Entries */}
      {selectedPlant.journalEntries && selectedPlant.journalEntries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Journal Entries ({selectedPlant.journalEntries.length})
          </Text>
          
          {selectedPlant.journalEntries.map((entry: any, index: number) => {
            console.log('Journal entry photoUrl:', entry.photoUrl);
            return (
              <View key={entry.entryId || index} style={styles.journalEntry}>
                <Text style={styles.journalDate}>
                  {formatDate(entry.createdAt)}
                </Text>
                <Text style={styles.journalText}>{entry.notes}</Text>
                {entry.photoUrl && validatePhotoUrl(entry.photoUrl) && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: entry.photoUrl }} 
                      style={styles.journalImage}
                      onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
                      onLoad={() => console.log('Image loaded successfully:', entry.photoUrl)}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Plant Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plant Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {selectedPlant.journalEntries?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Journal Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {selectedPlant.careTips ? Object.keys(selectedPlant.careTips).filter(key => selectedPlant.careTips[key]).length : 0}
            </Text>
            <Text style={styles.statLabel}>Care Tips</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MAIN_BG_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20)
  },
  loadingText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_9,
    marginTop: verticalScale(10)
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(32),
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.ERROR_COLOR,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  retryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
  },
  retryButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.8),
  },
  header: {
    backgroundColor: COLORS.HEADER_BG_COLOR,
    padding: scale(24),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(20),
    marginHorizontal: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: scale(10),
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  imagePlaceholder: {
    width: scale(120),
    height: verticalScale(120),
    borderRadius: scale(60),
    backgroundColor: COLORS.MAIN_BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  imagePlaceholderText: {
    fontSize: responsiveFontSize(6),
  },
  plantName: {
    fontSize: responsiveFontSize(3.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(4),
  },
  scientificName: {
    fontSize: responsiveFontSize(1.9),
    color: COLORS.TEXT_COLOR_2,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: scale(16),
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  deleteButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  actionButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(2),
  },
  section: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    margin: scale(16),
    padding: scale(20),
    borderRadius: scale(12),
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    color: COLORS.TEXT_COLOR_5,
    width: scale(100),
    flexShrink: 0,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.PLACEHOLDER_COLOR,
    flex: 1,
    marginLeft: scale(8),
  },
  journalEntry: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    padding: scale(16),
    borderRadius: scale(8),
    marginBottom: verticalScale(12),
    borderLeftWidth: scale(4),
    borderLeftColor: COLORS.BORDER_COLOR,
  },
  journalDate: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.TEXT_COLOR_5,
    marginBottom: verticalScale(8),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
  },
  journalText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_1,
    marginBottom: verticalScale(8),
  },
  imageContainer: {
    marginTop: verticalScale(8),
  },
  journalImage: {
    width: scale(120),
    height: verticalScale(120),
    borderRadius: scale(8),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: responsiveFontSize(4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_7,
  },
  statLabel: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.TEXT_COLOR_5,
    marginTop: verticalScale(4),
  },
  journalButtonContainer: {
    padding: scale(16),
  },
  journalButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  journalButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(2),
  },
});
