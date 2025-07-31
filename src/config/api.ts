// API Configuration for different environments
const getBaseURL = () => {
  // For different development scenarios:
  // - Android Emulator: http://10.0.2.2:5000/api/
  // - iOS Simulator: http://localhost:5000/api/
  // - Physical Device: http://YOUR_MACHINE_IP:5000/api/
  
  // You can change this based on your setup
  // For Android emulator:
  return 'http://192.168.29.84:5000/api/';
  
  // For iOS simulator, uncomment this line:
  // return 'http://localhost:5000/api/';
  
  // For physical devices, replace with your machine's IP:
  // return 'http://192.168.1.XXX:5000/api/';
};

export const API_CONFIG = {
  baseURL: getBaseURL(),
  timeout: 10000, // 10 seconds
};

export default API_CONFIG; 