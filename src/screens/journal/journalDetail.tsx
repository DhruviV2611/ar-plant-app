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
      
      {/* New Observation Details Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Observation Details</Text>
                <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{entry.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{entry.date || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>{entry.location || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Subject:</Text>
          <Text style={styles.infoValue}>{entry.subject || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Health Status:</Text>
          <Text style={styles.infoValue}>{entry.healthStatus || 'N/A'}</Text>
        </View>

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
          <Text style={styles.infoLabel}>Last Updated:</Text>
          <Text style={styles.infoValue}>{formatDate(entry.updatedAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Entry ID:</Text>
          <Text style={styles.infoValue}>{entry.entryId}</Text>
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
            <Text style={styles.quickActionText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleEditJournalEntry()}
          >
            <Text style={styles.quickActionText}>Edit </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleDeleteJournalEntry()}
          >
            <Text style={styles.quickActionText}>Delete </Text>
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
    padding: scale(16),
  },
  header: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_8,
  },
  date: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_5,
    marginTop: verticalScale(5),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  actionButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginHorizontal: scale(5),
  },
  editButton: {
 backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  deleteButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  actionButtonText: {
    color: COLORS.CARD_BG_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(1.8),
  },
  contentSection: {
    marginBottom: verticalScale(20),
    padding: scale(10),
    borderRadius: scale(8),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(10),
  },
  notesContainer: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: scale(8),
    padding: scale(10),
    minHeight: verticalScale(100),
  },
  notesText: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_LIGHT,
    color: COLORS.TEXT_COLOR_8,
    lineHeight: responsiveFontSize(2.2),
  },
  photoContainer: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  infoRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: verticalScale(6),
  flexWrap: 'wrap',
   
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_8,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_9,
     marginLeft: scale(9),

    
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    borderRadius: scale(5),
    alignItems: 'center',
    marginHorizontal: scale(5),
  },
  quickActionText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(2),alignItems: 'center',

  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.ERROR_COLOR,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  retryButtonText: {
    color: COLORS.TEXT_COLOR_6,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(2),
  },
});