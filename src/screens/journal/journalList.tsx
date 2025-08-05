import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPlantByIdRequest,
  deleteJournalEntryRequest,
} from '../../redux/actions/plantAction';
import { JournalEntry } from '../../redux/types/plantType';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';

export default function JournalListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { plantId } = route.params;
  const { selectedPlant, loading, error } = useSelector(
    (state: any) => state.plantState,
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (plantId) {
      dispatch(getPlantByIdRequest(plantId));
    }
  }, [plantId, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (plantId) {
      await dispatch(getPlantByIdRequest(plantId));
    }
    setRefreshing(false);
  };

  const handleViewJournalEntry = (entry: JournalEntry) => {
    (navigation as any).navigate('JournalDetail', { 
      plantId, 
      entryId: entry.entryId,
      entry 
    });
  };

  const handleEditJournalEntry = (entry: JournalEntry) => {
    (navigation as any).navigate('JournalEdit', { 
      plantId, 
      entryId: entry.entryId,
      entry 
    });
  };

  const handleDeleteJournalEntry = (entry: JournalEntry) => {
    Alert.alert(
      'Delete Journal Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (plantId && entry.entryId) {
              dispatch(deleteJournalEntryRequest(plantId, entry.entryId));
            }
          },
        },
      ],
    );
  };

  const handleAddJournalEntry = () => {
    (navigation as any).navigate('JournalAdd', { plantId });
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No date';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Text style={styles.journalDate}>{formatDate(item.createdAt)}</Text>
        <View style={styles.journalActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewJournalEntry(item)}
          >
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditJournalEntry(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteJournalEntry(item)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.journalNotes} >
        {item.notes}
      </Text>

      {item.photoUrl && (
        <Image source={{ uri: item.photoUrl }} style={styles.journalImage} />
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading journal entries...</Text>
      </View>
    );
  }

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

  const journalEntries = selectedPlant?.journalEntries || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Journal Entries
          {selectedPlant && ` - ${selectedPlant.name}`}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddJournalEntry}
        >
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>

      {journalEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No journal entries yet</Text>
          <Text style={styles.emptySubtext}>
            Start documenting your plant's journey by adding your first journal entry!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddJournalEntry}
          >
            <Text style={styles.emptyButtonText}>Add First Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={journalEntries}
          renderItem={renderJournalEntry}
          keyExtractor={(item) => item.entryId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
    backgroundColor:COLORS.MAIN_BG_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    color: COLORS.ERROR_COLOR,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  retryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: 16,
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
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: 6,
  },
  addButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(1.5),
  },
  listContainer: {
    padding: scale(16),
  },
  journalCard: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: 12,
    padding: scale(16),
    marginBottom: 16,
    shadowColor: COLORS.SHADOW_COLOR_1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  journalDate: {
    fontSize: 14,
    color: COLORS.TEXT_COLOR_9,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    flex: 1,
  },
  journalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  editButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  deleteButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  actionButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.5),
  },
  journalNotes: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR,
    lineHeight: 22,
    marginBottom: verticalScale(12),
  },
  journalImage: {
    width: '100%',
    height: scale(200),
    borderRadius: 8,
    resizeMode: 'cover',
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
  emptyButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.5),
  },
}); 