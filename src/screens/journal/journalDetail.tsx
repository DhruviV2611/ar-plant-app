import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { deleteJournalEntryRequest } from '../../redux/actions/plantAction';
import { COLORS } from '../../theme/color';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import { FONTS } from '../../constant/Fonts';

export default function JournalDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { plantId, entryId, entry } = route.params;

  const handleEditJournalEntry = () => {
    (navigation as any).navigate('JournalEdit', { 
      plantId, 
      entryId,
      entry 
    });
  };

  const handleDeleteJournalEntry = () => {
    Alert.alert(
      'Delete Journal Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (plantId && entryId) {
              dispatch(deleteJournalEntryRequest(plantId, entryId));
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No date';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
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

  if (!entry) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Journal entry not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Journal Entry</Text>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditJournalEntry}
        >
          <Text style={styles.actionButtonText}>Edit Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteJournalEntry}
        >
          <Text style={styles.actionButtonText}>Delete Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Journal Content */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{entry.notes}</Text>
        </View>
      </View>

      {/* Photo Section */}
      {entry.photoUrl && (
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Photo</Text>
          <View style={styles.photoContainer}>
            <Image 
              source={{ uri: entry.photoUrl }} 
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {/* Entry Information */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Entry Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>{formatDate(entry.createdAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Entry ID:</Text>
          <Text style={styles.infoValue}>{entry.entryId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Has Photo:</Text>
          <Text style={styles.infoValue}>
            {entry.photoUrl ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.quickActionText}>Back to Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => (navigation as any).navigate('JournalList', { plantId })}
          >
            <Text style={styles.quickActionText}>All Entries</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.ERROR_COLOR,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderRadius: scale(6),
  },
  retryButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.6),
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
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: 8,
  },
  date: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.BUTTON_PRIMARY_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    width: '50%',
    textAlign: 'right'
  },
  actionButtons: {
    flexDirection: 'row',
    padding: scale(16),
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
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
    fontSize: responsiveFontSize(1.6),
  },
  contentSection: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    margin: scale(16),
    padding: scale(20),
    borderRadius: scale(12),
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(16),
  },
  notesContainer: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    padding: scale(16),
    borderRadius: scale(8),
    borderLeftWidth: scale(4),
    borderLeftColor: COLORS.BORDER_COLOR,
  },
  notesText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_6,
    lineHeight: verticalScale(24),
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: scale(200),
    borderRadius: scale(12),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: scale(12),
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_4,
    width: 100,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.TEXT_COLOR_5,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderRadius: scale(8),
    minWidth: scale(120),
    alignItems: 'center',
  },
  quickActionText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.4),
  },
}); 