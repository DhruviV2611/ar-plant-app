import React, { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPlantRequest, updatePlantRequest } from "../../redux/actions/plantAction";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Plant } from "../../redux/types/plantType";

export default function AddPlantScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const existingPlant: Plant | undefined = route.params?.plant;

  const [name, setName] = useState(existingPlant?.name || "");
  const [careTips, setCareTips] = useState(existingPlant?.careTips || "");
  const [toxicity, setToxicity] = useState(existingPlant?.toxicity || "");

  const { loading, error } = useSelector((state: any) => state.plantState);

  const isEdit = Boolean(existingPlant?._id);

  const handleSubmit = () => {
    if (!name || !careTips || !toxicity) {
      Alert.alert("All fields are required");
      return;
    }

    const plantData: Plant = {
      _id: existingPlant?._id,
      name,
      careTips,
      toxicity,
    };

    if (isEdit) {
      dispatch(updatePlantRequest(plantData));
      console.log("updated");
    } else {
      dispatch(addPlantRequest(plantData));
      console.log("added");
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Plant Name" />
      <Text style={styles.label}>Care Tips</Text>
      <TextInput style={styles.input} value={careTips} onChangeText={setCareTips} placeholder="Care Tips" />
      <Text style={styles.label}>Toxicity</Text>
      <TextInput style={styles.input} value={toxicity} onChangeText={setToxicity} placeholder="Toxicity" />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title={loading ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Plant" : "Add Plant"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 4 },
});
