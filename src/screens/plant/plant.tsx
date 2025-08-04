import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlantRequest,
  updatePlantRequest,
  getPlantByIdRequest,
  getCareTipsRequest,
  getToxicityInfoRequest,
  addJournalEntryRequest,
  deleteJournalEntryRequest,
  exportPDFRequest
} from "../../redux/actions/plantAction";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Plant } from "../../redux/types/plantType";
import { commonStyles } from "../../theme/commonStyle";
import { responsiveFontSize, scale, verticalScale } from "../../utills/scallingUtills";

export default function PlantScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const existingPlant: Plant | undefined = route.params?.plant;
  const plantId = route.params?.plantId;

  // Form state
  const [name, setName] = useState(existingPlant?.name || "");
  const [scientificName, setScientificName] = useState(existingPlant?.scientificName || "");
  const [light, setLight] = useState(existingPlant?.careTips?.light || "");
  const [water, setWater] = useState(existingPlant?.careTips?.water || "");
  const [temperature, setTemperature] = useState(existingPlant?.careTips?.temperature || "");
  const [humidity, setHumidity] = useState(existingPlant?.careTips?.humidity || "");
  const [toxicitySeverity, setToxicitySeverity] = useState(existingPlant?.toxicity?.severity || "");
  const [toxicitySymptoms, setToxicitySymptoms] = useState(existingPlant?.toxicity?.symptoms || "");
  const [toxicityNotes, setToxicityNotes] = useState(existingPlant?.toxicity?.notes || "");

  // Journal entry state
  const [journalNotes, setJournalNotes] = useState("");
  const [journalPhotoUrl, setJournalPhotoUrl] = useState("");

  const {
    loading,
    error,
    selectedPlant,
    careTips,
    toxicityInfo,
    pdfLoading
  } = useSelector((state: any) => state.plantState);

  const isEdit = Boolean(existingPlant?._id);

  // Load plant details if plantId is provided
  React.useEffect(() => {
    if (plantId && !existingPlant) {
      dispatch(getPlantByIdRequest(plantId));
    }
  }, [plantId, existingPlant, dispatch]);

  // Update form when selectedPlant changes
  React.useEffect(() => {
    if (selectedPlant && !existingPlant) {
      setName(selectedPlant.name || "");
      setScientificName(selectedPlant.scientificName || "");
      setLight(selectedPlant.careTips?.light || "");
      setWater(selectedPlant.careTips?.water || "");
      setTemperature(selectedPlant.careTips?.temperature || "");
      setHumidity(selectedPlant.careTips?.humidity || "");
      setToxicitySeverity(selectedPlant.toxicity?.severity || "");
      setToxicitySymptoms(selectedPlant.toxicity?.symptoms || "");
      setToxicityNotes(selectedPlant.toxicity?.notes || "");
    }
  }, [selectedPlant, existingPlant]);

  const handleSubmit = () => {
    if (!name) {
      Alert.alert("Plant name is required");
      return;
    }

    const plantData: Plant = {
      _id: existingPlant?._id || selectedPlant?._id,
      name,
      scientificName,
      careTips: {
        light,
        water,
        temperature,
        humidity,
      },
      toxicity: {
        severity: toxicitySeverity,
        symptoms: toxicitySymptoms,
        notes: toxicityNotes,
      },
    };

    if (isEdit || selectedPlant?._id) {
      dispatch(updatePlantRequest(plantData));
      Alert.alert("Success", "Plant updated successfully!");
    } else {
      dispatch(addPlantRequest(plantData));
      console.log("plantData",plantData);
      
      Alert.alert("Success", "Plant added successfully!");
    }

    navigation.goBack();
  };

  const handleGetCareTips = () => {
    if (scientificName) {
      dispatch(getCareTipsRequest(scientificName));
    } else {
      Alert.alert("Please enter a scientific name first");
    }
  };

  const handleGetToxicityInfo = () => {
    const currentPlantId = existingPlant?._id || selectedPlant?._id;
    if (currentPlantId) {
      dispatch(getToxicityInfoRequest(currentPlantId));
    } else {
      Alert.alert("Please save the plant first");
    }
  };

  const handleAddJournalEntry = () => {
    if (!journalNotes.trim()) {
      Alert.alert("Please enter journal notes");
      return;
    }

    const currentPlantId = existingPlant?._id || selectedPlant?._id;
    if (currentPlantId) {
      dispatch(addJournalEntryRequest(currentPlantId, {
        notes: journalNotes,
        photoUrl: journalPhotoUrl,
      }));
      setJournalNotes("");
      setJournalPhotoUrl("");
      Alert.alert("Success", "Journal entry added!");
    } else {
      Alert.alert("Please save the plant first");
    }
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    const currentPlantId = existingPlant?._id || selectedPlant?._id;
    if (currentPlantId) {
      dispatch(deleteJournalEntryRequest(currentPlantId, entryId));
      Alert.alert("Success", "Journal entry deleted!");
    }
  };

  const handleExportPDF = () => {
    dispatch(exportPDFRequest());
    Alert.alert("Success", "PDF export started!");
  };

  const currentPlant = existingPlant || selectedPlant;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEdit || selectedPlant?._id ? "Edit Plant" : "Add New Plant"}
      </Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <Text style={styles.label}>Plant Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Plant Name"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Scientific Name</Text>
        <TextInput
          style={styles.input}
          value={scientificName}
          onChangeText={setScientificName}
          placeholder="Scientific Name"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />
      </View>

      {/* Care Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Care Tips</Text>
        <Text style={styles.label}>Light Requirements</Text>
        <TextInput
          style={styles.input}
          value={light}
          onChangeText={setLight}
          placeholder="Light requirements"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Water Requirements</Text>
        <TextInput
          style={styles.input}
          value={water}
          onChangeText={setWater}
          placeholder="Water requirements"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Temperature</Text>
        <TextInput
          style={styles.input}
          value={temperature}
          onChangeText={setTemperature}
          placeholder="Temperature requirements"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Humidity</Text>
        <TextInput
          style={styles.input}
          value={humidity}
          onChangeText={setHumidity}
          placeholder="Humidity requirements"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetCareTips}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Get Care Tips</Text>
        </TouchableOpacity>

        {careTips && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Care Tips:</Text>
            <Text>{JSON.stringify(careTips, null, 2)}</Text>
          </View>
        )}
      </View>

      {/* Toxicity Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toxicity Information</Text>
        <Text style={styles.label}>Severity</Text>
        <TextInput
          style={styles.input}
          value={toxicitySeverity}
          onChangeText={setToxicitySeverity}
          placeholder="Toxicity severity"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Symptoms</Text>
        <TextInput
          style={styles.input}
          value={toxicitySymptoms}
          onChangeText={setToxicitySymptoms}
          placeholder="Toxicity symptoms"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.input}
          value={toxicityNotes}
          onChangeText={setToxicityNotes}
          placeholder="Additional notes"
          placeholderTextColor={commonStyles.placeholderColor.color}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetToxicityInfo}
          disabled={loading}
          
        >
          <Text style={styles.buttonText}>Get Toxicity Info</Text>
        </TouchableOpacity>

        {toxicityInfo && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Toxicity Info:</Text>
            <Text>{JSON.stringify(toxicityInfo, null, 2)}</Text>
          </View>
        )}
      </View>

      {/* Journal Entries */}
      {currentPlant && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journal Entries</Text>

          <Text style={styles.label}>Add Journal Entry</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={journalNotes}
            onChangeText={setJournalNotes}
            placeholder="Journal notes"
            placeholderTextColor={commonStyles.placeholderColor.color}
            multiline
          />

          <Text style={styles.label}>Photo URL (optional)</Text>
          <TextInput
            style={styles.input}
            value={journalPhotoUrl}
            onChangeText={setJournalPhotoUrl}
            placeholder="Photo URL"
            placeholderTextColor={commonStyles.placeholderColor.color}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAddJournalEntry}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Add Journal Entry</Text>
          </TouchableOpacity>

          {/* Display existing journal entries */}
          {currentPlant.journalEntries && currentPlant.journalEntries.length > 0 && (
            <View style={styles.journalEntries}>
              <Text style={styles.infoTitle}>Recent Entries:</Text>
              {currentPlant.journalEntries.map((entry: any, index: number) => (
                <View key={entry.entryId || index} style={styles.journalEntry}>
                  <Text style={styles.journalText}>{entry.notes}</Text>
                  {entry.photoUrl && (
                    <Image source={{ uri: entry.photoUrl }} style={styles.journalImage} />
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteJournalEntry(entry.entryId)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? (isEdit || selectedPlant?._id ? "Updating..." : "Adding...") :
              (isEdit || selectedPlant?._id ? "Update Plant" : "Add Plant")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportPDF}
          disabled={pdfLoading}
        >
          <Text style={styles.buttonText}>
            {pdfLoading ? "Exporting..." : "Export PDF"}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
    backgroundColor: '#e8f5e9'
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    color: '#2c3e50'
  },
  section: {
    backgroundColor: 'white',
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: verticalScale(12),
    color: '#2c3e50'
  },
  label: {
    fontWeight: 'bold',
    marginTop: verticalScale(12),
    color: '#34495e'
  },
  input: {
    borderWidth: scale(1),
    borderColor: '#ddd',
    borderRadius: scale(4),
    padding: scale(12),
    marginTop: verticalScale(4),
    backgroundColor: '#fafafa'
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#3498db',
    padding: scale(12),
    borderRadius: scale(6),
    marginTop: verticalScale(12),
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#27ae60'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8)
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    padding: scale(12),
    borderRadius: scale(6),
    marginTop: verticalScale(12),
    borderLeftWidth: scale(4),
    borderLeftColor: '#3498db'
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    color: '#2c3e50'
  },
  journalEntries: {
    marginTop: verticalScale(16)
  },
  journalEntry: {
    backgroundColor: '#f8f9fa',
    padding: scale(12),
    borderRadius: scale(6),
    marginTop: verticalScale(8),
    borderLeftWidth: scale(3),
    borderLeftColor: '#27ae60'
  },
  journalText: {
    marginBottom: verticalScale(8),
    color: '#2c3e50'
  },
  journalImage: {
    width: scale(100),
    height: verticalScale(100),
    borderRadius: scale(6),
    marginBottom: verticalScale(8)
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: scale(6),
    borderRadius: scale(4),
    alignSelf: 'flex-start'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold'
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: verticalScale(12),
    fontWeight: 'bold'
  }
});

