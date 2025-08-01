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

  const getToxicityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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
                style={[
                  styles.infoValue,
                  { color: getToxicityColor(selectedPlant.toxicity.severity) },
                ]}
              >
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
                  {entry.date ? new Date(entry.date).toLocaleDateString() : 'No date'}
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    fontSize: 16,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    width: 100,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  journalEntry: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  journalDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  journalText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  imageContainer: {
    marginTop: 8,
  },
  journalImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  journalButtonContainer: {
    padding: 16,
  },
  journalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  journalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 