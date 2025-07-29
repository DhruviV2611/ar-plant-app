// home.tsx
import React, { useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deletePlantRequest, fetchPlantsRequest } from "../../redux/actions/plantAction";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../constant/type";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { plants, loading, error } = useSelector((state: any) => state.plantState); // Corrected: Access plantState
console.log('plants',JSON.stringify(plants))
    useEffect(() => {
        dispatch(fetchPlantsRequest());
    }, [dispatch]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Button title="Add Plant" onPress={() => navigation.navigate("AddPlant", { plant: null })}/>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <FlatList
                data={plants}   
                keyExtractor={item => item._id || item.name}
                renderItem={({ item }) => (
                    <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text>Care Tips: {item.careTips}</Text>
                        <Text>Toxicity: {item.toxicity}</Text>
                        <Button
  title="Delete"
  color="red"
  onPress={() => dispatch(deletePlantRequest(item._id))}
/>
<Button
  title="Edit"
  onPress={() => navigation.navigate("AddPlant", { plant: item })}
/>

                    </View>
                )}
            />
        </View>
    );
}