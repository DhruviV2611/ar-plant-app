import React, { useState, useCallback } from 'react';
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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {
  getPlantByIdRequest,
  deleteJournalEntryRequest,
} from '../../redux/actions/plantAction';
import { JournalEntry } from '../../redux/types/plantType';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';
import {
  responsiveFontSize,
  scale,
  verticalScale,
} from '../../utills/scallingUtills';

export default function JournalListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { plantId } = route.params;
  const { selectedPlant, loading, error } = useSelector(
    (state: any) => state.plantState,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (plantId) {
        dispatch(getPlantByIdRequest(plantId));
      }
    }, [plantId, dispatch]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (plantId) {
      await dispatch(getPlantByIdRequest(plantId));
    }
    setRefreshing(false);
  }, [plantId, dispatch]);

  const handleViewJournalEntry = (entry: JournalEntry) => {
    (navigation as any).navigate('JournalDetail', {
      plantId,
      entryId: entry.entryId,
      entry,
    });
  };

  const handleEditJournalEntry = (entry: JournalEntry) => {
    (navigation as any).navigate('JournalEdit', {
      plantId,
      entryId: entry.entryId,
      entry,
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
      });
    } catch {
      return 'Invalid date';
    }
  };

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => (
    <View style={styles.journalCard}>
      <View style={styles.journalHeader}>
        <Text style={styles.journalDate}>
          {formatDate(item.date || item.createdAt)}
        </Text>
        <Text style={styles.journalLocation}>
          {item.location || 'No Location'}
        </Text>
      </View>

      <View style={styles.journalContent}>
        {item.photoUrl && (
          <Image source={{ uri: item.photoUrl }} style={styles.journalImage} />
        )}
        <Text style={styles.Detailtitle}>{item.name || ''}</Text>
        <Text style={styles.journalSubject}>{item.subject || ''}</Text>

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text
            style={styles.journalNotes}
            numberOfLines={expanded ? undefined : 4}
          >
            {item.notes}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.journalFooter}>
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
          Journal Entries {selectedPlant && ` - ${selectedPlant.name}`}
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
            Start documenting your plant's journey by adding your first journal
            entry!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleAddJournalEntry}
          >
            <Text style={styles.emptyButtonText}>Add New Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={journalEntries
            .slice()
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )}
          renderItem={renderJournalEntry}
          keyExtractor={item => item.entryId}
          showsVerticalScrollIndicator={false}
          style={styles.listContainer}
          refreshControl={
               <RefreshControl refreshing={loading} onRefresh={handleRefresh}  colors={[COLORS.TEXT_COLOR]}/>
          }
        />
      )}
    </View>
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
  },
  listContainer: {
    padding: scale(16),
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
  journalCard: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: scale(8),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: COLORS.SHADOW_COLOR_1,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  journalDate: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_9,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    flex: 1,
  },
  journalSubject: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_9,
  },

  Detailtitle: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    color: COLORS.TEXT_COLOR_8,
  },
  journalContent: {
    flexDirection: 'column',
    marginTop: verticalScale(10),
  },
  journalImage: {
    width: '100%',
    height: scale(160),
    borderRadius: scale(8),
    marginBottom: verticalScale(8),
    resizeMode: 'cover',
  },
  journalNotes: {
    fontSize: responsiveFontSize(1.8),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    lineHeight: 22,
  },
  journalFooter: {
    flexDirection: 'column',
    marginTop: verticalScale(10),
  },
  journalLocation: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.PLACEHOLDER_COLOR,
    marginBottom: verticalScale(6),
  },
  journalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(6),
    borderRadius: scale(6),
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
