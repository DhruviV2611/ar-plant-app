import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateJournalEntryRequest } from '../../redux/actions/plantAction';
import ImagePicker from '../../components/ImagePicker';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';

export default function JournalEditScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { plantId, entryId, entry } = route.params;
  const { selectedPlant } = useSelector(
    (state: any) => state.plantState,
  );

  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (entry) {
      setNotes(entry.notes || '');
      setPhotoUrl(entry.photoUrl || '');
    }
  }, [entry]);

  useEffect(() => {
    const originalNotes = entry?.notes || '';
    const originalPhotoUrl = entry?.photoUrl || '';
    setHasChanges(notes !== originalNotes || photoUrl !== originalPhotoUrl);
  }, [notes, photoUrl, entry]);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Error', 'Please enter journal notes');
      return;
    }

    if (!plantId || !entryId) {
      Alert.alert('Error', 'Plant ID and Entry ID are required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(updateJournalEntryRequest(plantId, entryId, {
        notes: notes.trim(),
        photoUrl: photoUrl.trim() || undefined,
      }));
      
      Alert.alert('Success', 'Journal entry updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Journal Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Navigate to detail screen which has delete functionality
            (navigation as any).navigate('JournalDetail', { 
              plantId, 
              entryId,
              entry 
            });
          },
        },
      ],
    );
  };

  const validatePhotoUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isPhotoUrlValid = validatePhotoUrl(photoUrl);
  const canSubmit = notes.trim() && !isSubmitting && isPhotoUrlValid && hasChanges;

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
        <Text style={styles.title}>Edit Journal Entry</Text>
        {selectedPlant && (
          <Text style={styles.subtitle}>for {selectedPlant.name}</Text>
        )}
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Write about your plant's progress, care activities, observations, or any notes you'd like to remember..."
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
        <Text style={styles.characterCount}>
          {notes.length}/1000 characters
        </Text>
      </View>

      {/* Photo Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photo (Optional)</Text>
        <Text style={styles.photoHelpText}>
          Add a photo to document your plant's progress. You can take a new photo or choose from your gallery.
        </Text>
        
        {/* Image Picker Component */}
        <ImagePicker
          onImageSelected={(imageUri) => setPhotoUrl(imageUri)}
          onImageError={(error) => {
            Alert.alert('Error', error);
          }}
          showPreview={true}
          quality={0.8}
        />
        
        {/* Fallback URL Input */}
        <Text style={styles.photoHelpText}>
          Or enter a photo URL manually:
        </Text>
        <TextInput
          style={[styles.input, !isPhotoUrlValid && photoUrl.trim() && styles.inputError]}
          value={photoUrl}
          onChangeText={setPhotoUrl}
          placeholder="https://example.com/photo.jpg"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isPhotoUrlValid && photoUrl.trim() && (
          <Text style={styles.errorText}>
            Please enter a valid URL
          </Text>
        )}
      </View>

      {/* Original Entry Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Original Entry</Text>
        <View style={styles.originalInfo}>
          <Text style={styles.originalLabel}>Created:</Text>
          <Text style={styles.originalValue}>
            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Unknown'}
          </Text>
        </View>
        <View style={styles.originalInfo}>
          <Text style={styles.originalLabel}>Entry ID:</Text>
          <Text style={styles.originalValue}>{entry.entryId}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={isSubmitting}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Updating...' : 'Update Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.ERROR_COLOR,
    marginTop: verticalScale(4),
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
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_2,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  section: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    margin: scale(16),
    padding: verticalScale(20),
    borderRadius: scale(12),
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_3,
    marginBottom: verticalScale(12),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_1,
    borderRadius: scale(8),
    padding: verticalScale(16),
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_5,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
    inputError: {
    borderColor: COLORS.ERROR_COLOR,
  },
  characterCount: {
    fontSize: responsiveFontSize(1.2),
    color: COLORS.TEXT_COLOR_2,
    textAlign: 'right',
    marginTop: verticalScale(4),
  },

  photoPreview: {
    marginTop: verticalScale(12),
  },
  photoPreviewText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_3,
    marginBottom: verticalScale(8),
  },
  previewImage: {
    width: scale(200),
    height: verticalScale(200),
    borderRadius: 8,
  },
  imageLoadingContainer: {
    width: scale(200),
    height: scale(200),
    borderRadius: 8,
    backgroundColor: COLORS.BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.BORDER_COLOR_1,
  },
  imageLoadingText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.TEXT_COLOR_6,
  },
  imageErrorContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.ERROR_COLOR,
  },
  imageErrorText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.ERROR_COLOR,
    marginBottom: verticalScale(8),
  },
  retryButton: {
    backgroundColor: COLORS.BORDER_COLOR_1,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(4),
  },
  retryButtonText: {
    color: COLORS.TEXT_COLOR_3,
    fontSize: responsiveFontSize(1.2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  photoHelpText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.TEXT_COLOR_2,
    marginBottom: verticalScale(8),
    lineHeight: 20,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  photoHelpList: {
    marginBottom: verticalScale(12),
    paddingLeft: scale(8),
  },
  photoHelpItem: {
    fontSize: responsiveFontSize(1.3),
    color: COLORS.TEXT_COLOR_2,
    marginBottom: verticalScale(4),
  },

  originalInfo: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
  },
  originalLabel: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.TEXT_COLOR_4,
    width: 80,
    flexShrink: 0,
  },
  originalValue: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.TEXT_COLOR_5,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: scale(16),
    gap: scale(8),
  },
  button: {
    flex: 1,
    paddingVertical: scale(16),
    borderRadius: scale(8),
    alignItems: 'center',
  },
cancelButton: {
       borderWidth: scale(1),
    borderColor: COLORS.BORDER_COLOR,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  submitButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.4),
  },
  deleteButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.4),
  },
  submitButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.4),
  },
}); 