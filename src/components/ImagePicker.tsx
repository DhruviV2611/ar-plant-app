import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';

interface ImagePickerProps {
  onImageSelected: (imageUri: string) => void;
  onImageError?: (error: string) => void;
  showPreview?: boolean;
  quality?: number;
}

export default function ImagePicker({
  onImageSelected,
  onImageError,
  showPreview = true,
  quality = 0.8,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    console.log('ImagePicker Response:', response);
    
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      const errorMessage = response.errorMessage || 'Failed to pick image';
      console.error('ImagePicker Error:', response.errorCode, errorMessage);
      Alert.alert('Error', errorMessage);
      onImageError?.(errorMessage);
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      console.log('Selected asset:', asset);
      if (asset.uri) {
        setSelectedImage(asset.uri);
        onImageSelected(asset.uri);
        setModalVisible(false);
      } else {
        console.error('No URI in asset:', asset);
        Alert.alert('Error', 'No image URI received');
      }
    } else {
      console.error('No assets in response:', response);
      Alert.alert('Error', 'No image selected');
    }
  };

  const openCamera = () => {
    console.log('Opening camera...');
    const options = {
      mediaType: 'photo' as MediaType,
      quality: quality as PhotoQuality,
      includeBase64: false,
      saveToPhotos: true,
    };

    console.log('Camera options:', options);
    try {
      launchCamera(options, handleImagePickerResponse);
    } catch (error) {
      console.error('Camera launch error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = () => {
    console.log('Opening gallery...');
    const options = {
      mediaType: 'photo' as MediaType,
      quality: quality as PhotoQuality,
      includeBase64: false,
      selectionLimit: 1,
    };

    console.log('Gallery options:', options);
    try {
      launchImageLibrary(options, handleImagePickerResponse);
    } catch (error) {
      console.error('Gallery launch error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const showImagePickerModal = () => {
    setModalVisible(true);
  };

  const clearImage = () => {
    setSelectedImage(null);
    onImageSelected('');
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      {showPreview && selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Image Picker Button */}
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={() => {
          console.log('Image picker button pressed');
          showImagePickerModal();
        }}
      >
        <Text style={styles.pickerButtonText}>
          {selectedImage ? 'Change Photo' : 'Add Photo'}
        </Text>
      </TouchableOpacity>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Photo</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                console.log('Camera button pressed');
                openCamera();
              }}
            >
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                console.log('Gallery button pressed');
                openGallery();
              }}
            >
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    marginTop: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 