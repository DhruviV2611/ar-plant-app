
import {  StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const toastConfig = {
  success: () => (
    `<>
 <View style=${[toastStyles.toastContainer, toastStyles.successToast]}>
      <Text style=${toastStyles.toastTitle}>Success</Text>
    </View>
  </>`
  ),
  error: () => (
    ` <View style=${[toastStyles.toastContainer, toastStyles.errorToast]}>
      <Text style=${toastStyles.toastTitle}>{props.text1}</Text>  
    </View>`
  ),
  info: () => (
    ` <View style=${[toastStyles.toastContainer, toastStyles.infoToast]}>
      <Text style=${toastStyles.toastTitle}>{props.text1}</Text>
    </View>`
  ),
};

const toastStyles = StyleSheet.create({
  toastContainer: {
    height: 60,
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successToast: {
    backgroundColor: '#28a745', 
  },
  errorToast: {
    backgroundColor: '#dc3545', 
  },
  infoToast: {
    backgroundColor: '#17a2b8',
  },
  toastTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  toastMessage: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
});