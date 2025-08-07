import React, { useState } from 'react';
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
import { addJournalEntryRequest, getPlantByIdRequest } from '../../redux/actions/plantAction';
import ImagePicker from '../../components/ImagePicker';
import { COLORS } from '../../theme/color';
import {
  responsiveFontSize,
  scale,
  verticalScale,
} from '../../utills/scallingUtills';
import { FONTS } from '../../constant/Fonts';
import { Dropdown } from 'react-native-element-dropdown';

export default function JournalAddScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { plantId } = route.params;
  const { selectedPlant } = useSelector((state: any) => state.plantState);

  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const healthStatusData = [
    { label: 'Healthy', value: 'healthy' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
    { label: 'Poor', value: 'poor' },
    { label: 'Critical', value: 'critical' },
  ];

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Error', 'Please enter journal notes');
      return;
    }

    if (!plantId) {
      Alert.alert('Error', 'Plant ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass all new fields to the request
      await dispatch(
  addJournalEntryRequest(plantId, {
    notes: notes.trim(),
    photoUrl: photoUrl.trim() || undefined,
    date,
    location: location.trim(),
    subject: subject.trim(),
    name: name.trim(),
    healthStatus,
    callBack: (success: boolean) => {
      if (success) {
        dispatch(getPlantByIdRequest(plantId)); // re-fetch updated plant
        navigation.goBack();
      }
    },
  })
);

      Alert.alert('Success', 'Journal entry added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      notes.trim() ||
      photoUrl.trim() ||
      date ||
      location.trim() ||
      subject.trim() ||
      name.trim() ||
      healthStatus 
    ) {
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
  const canSubmit = notes.trim() && !isSubmitting && isPhotoUrlValid;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Journal Entry</Text>
        {selectedPlant && (
          <Text style={styles.subtitle}>for {selectedPlant.name}</Text>
        )}
      </View>

      {/* New Fields Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observation Details</Text>

        <Text style={[styles.label, { marginBottom: 5 }]}>Entry Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Entry Name"
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
        />
        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., My sunroom, Western India"
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
        />

        {/* Subject */}
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="enter subject"
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
        />

        {/* Health Status */}
        <Text style={styles.label}>Health Status</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={healthStatusData}
          labelField="label"
          valueField="value"
          placeholder="Select health status..."
          value={healthStatus}
          onChange={item => {
            setHealthStatus(item.value);
          }}
        />
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
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
          Add a photo to document your plant's progress. You can take a new
          photo or choose from your gallery.
        </Text>

        {/* Image Picker Component */}
        <ImagePicker
          onImageSelected={imageUri => setPhotoUrl(imageUri)}
          onImageError={error => {
            Alert.alert('Error', error);
          }}
          showPreview={true}
          quality={0.8}
        />

        {/* Fallback URL Input */}
        <Text style={styles.photoHelpText}>Or enter a photo URL manually:</Text>
        <TextInput
          style={[
            styles.input,
            !isPhotoUrlValid && photoUrl.trim() && styles.inputError,
          ]}
          value={photoUrl}
          onChangeText={setPhotoUrl}
          placeholder="https://example.com/photo.jpg"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
        />
        {!isPhotoUrlValid && photoUrl.trim() && (
          <Text style={styles.errorText}>Please enter a valid URL</Text>
        )}
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
          style={[
            styles.button,
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  title: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_2,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  label: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_3,
    marginTop: verticalScale(10),
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
  errorText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.ERROR_COLOR,
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
  tipsContainer: {
    backgroundColor: COLORS.SHADOW_COLOR_1,
    padding: scale(16),
    borderRadius: scale(8),
    borderLeftWidth: 4,
    borderLeftColor: COLORS.BORDER_COLOR,
  },
  tipText: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.BUTTON_PRIMARY_COLOR,
    marginBottom: verticalScale(6),
    lineHeight: 20,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: scale(16),
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(16),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: scale(1),
    borderColor: COLORS.BORDER_COLOR,
  },
  submitButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: COLORS.TEXT_COLOR_3,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    fontSize: responsiveFontSize(1.6),
  },
  submitButtonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    fontSize: responsiveFontSize(1.6),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  checkboxLabel: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
    color: COLORS.TEXT_COLOR_5,
    marginLeft: scale(18),
  },
  dropdown: {
    height: verticalScale(50),
    borderColor: COLORS.BORDER_COLOR_1,
    borderWidth: 1,
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    marginTop: verticalScale(5),
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.PLACEHOLDER_COLOR,
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
    color: COLORS.TEXT_COLOR_5,
  },
});
