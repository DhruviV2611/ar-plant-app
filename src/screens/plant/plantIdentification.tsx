import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  identifyPlantRequest,
  addPlantRequest,
} from '../../redux/actions/plantAction';
import { Plant } from '../../redux/types/plantType';
import ImagePicker from '../../components/ImagePicker';

export default function PlantIdentificationScreen() {
  const dispatch = useDispatch();
  const { loading, error, identifiedPlant } = useSelector(
    (state: any) => state.plantState,
  );

  const [imageBase64, setImageBase64] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [careTips, setCareTips] = useState('');

  const handleIdentifyPlant = () => {
    if (!imageBase64.trim()) {
      Alert.alert('Please enter an image (base64) for identification');
      return;
    }

    dispatch(identifyPlantRequest(imageBase64));
  };

  const handleAddIdentifiedPlant = () => {
    if (!plantName.trim()) {
      Alert.alert('Please enter a plant name');
      return;
    }

    if (!identifiedPlant) {
      Alert.alert('No plant identified yet');
      return;
    }

    const newPlant: Plant = {
      name: plantName,
      scientificName: identifiedPlant.scientificName,
      careTips: {
        light: careTips,
        water: '',
        temperature: '',
        humidity: '',
      },
      toxicity: {
        severity: '',
        symptoms: '',
        notes: '',
      },
    };

    dispatch(addPlantRequest(newPlant));
    setShowAddForm(false);
    setPlantName('');
    setCareTips('');
    Alert.alert('Success', 'Plant added to your collection!');
  };



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Plant Identification</Text>

      {/* Image Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Plant Image</Text>
        
        <Text style={styles.helpText}>
          Take a photo or select from your gallery to identify the plant.
        </Text>

        {/* Image Picker Component */}
        <ImagePicker
          onImageSelected={(imageUri) => {
            // Convert image URI to base64 for API
            // For now, we'll use the URI directly
            setImageBase64(imageUri);
          }}
          onImageError={(error) => {
            Alert.alert('Error', error);
          }}
          showPreview={true}
          quality={0.8}
        />

        <Text style={styles.label}>Or paste base64 image data manually:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={imageBase64}
          onChangeText={setImageBase64}
          placeholder="Paste base64 image data here..."
          multiline
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleIdentifyPlant}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Identifying...' : 'Identify Plant'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Identification Results */}
      {identifiedPlant && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identification Results</Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Scientific Name:</Text>
            <Text style={styles.resultText}>
              {identifiedPlant.scientificName}
            </Text>

            <Text style={styles.resultTitle}>Common Name:</Text>
            <Text style={styles.resultText}>{identifiedPlant.commonName}</Text>

            <Text style={styles.resultTitle}>Confidence Score:</Text>
            <Text style={styles.resultText}>
              {(identifiedPlant.confidenceScore * 100).toFixed(1)}%
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.buttonText}>Add to My Plants</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Plant Form */}
      {showAddForm && identifiedPlant && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add to My Plants</Text>

          <Text style={styles.label}>Plant Name *</Text>
          <TextInput
            style={styles.input}
            value={plantName}
            onChangeText={setPlantName}
            placeholder="Enter plant name"
          />

          <Text style={styles.label}>Care Tips</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={careTips}
            onChangeText={setCareTips}
            placeholder="Enter care tips..."
            multiline
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleAddIdentifiedPlant}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Adding...' : 'Add Plant'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <Text style={styles.instructionText}>
          1. Take a clear photo of the plant you want to identify{'\n'}
          2. Or select an image from your gallery{'\n'}
          3. The AI will analyze the image and provide identification{'\n'}
          4. Review the results and add to your plant collection{'\n'}
          5. Get detailed care tips and toxicity information
        </Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  helpText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginTop: 4,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#27ae60',
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  resultTitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  resultText: {
    color: '#34495e',
    marginBottom: 8,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  instructionText: {
    color: '#7f8c8d',
    lineHeight: 20,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: 'bold',
  },
});
