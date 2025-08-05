import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileRequest, logout, clearError, fetchUserRequest } from '../../redux/actions/authAction';
import { AppState } from '../../redux/store';
import { responsiveFontSize, scale, verticalScale } from '../../utills/scallingUtills';
import { COLORS } from '../../theme/color';
import { FONTS } from '../../constant/Fonts';

const ProfileScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const dispatch = useDispatch();
  const { user, token, error, loading } = useSelector((state: AppState) => state.authState);
console.log('token',token)
console.log('user',user)
  
  // Fetch user details when component mounts
  useEffect(() => {
    if (token && !user?.email) {
      dispatch(fetchUserRequest());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (!token) {
      navigation.replace('Login');
    }
  }, [token, navigation]);

  const handleUpdateProfile = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setUpdateLoading(true);
    try {
      dispatch(updateProfileRequest({ email }));
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.BUTTON_PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => dispatch(fetchUserRequest())}
              disabled={loading}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <Text style={styles.value}>{user.email}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.value}>{user._id}</Text>
          </View>

          {user.createdAt && (
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Member Since</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setEmail(user.email || '');
                  }}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.MAIN_BG_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_1,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  content: {
    padding: scale(20),
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    color: COLORS.TEXT_COLOR,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.CARD_BG_COLOR,
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: verticalScale(20),
    shadowColor: COLORS.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(3.84),
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  avatar: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: scale(40),
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: responsiveFontSize(4),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD,
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
  },
  refreshButton: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: COLORS.BG_COLOR,
    borderRadius: scale(6),
  },
  refreshButtonText: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.TEXT_COLOR_5,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  infoContainer: {
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.TEXT_COLOR_5,
    marginBottom: verticalScale(5),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOOK,
  },
  value: {
    fontSize: responsiveFontSize(2),
    color: COLORS.TEXT_COLOR_4,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  input: {
    borderWidth: scale(1),
    borderColor: COLORS.BORDER_COLOR_1,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    fontSize: responsiveFontSize(2),
  },
  buttonContainer: {
    marginTop: verticalScale(20),
  },
  button: {
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  editButton: {
    backgroundColor:  COLORS.BUTTON_PRIMARY_COLOR,
  },
  saveButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
  },
  cancelButton: {
      borderWidth: scale(1),
    borderColor: COLORS.BORDER_COLOR,
  },
  buttonText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
  },
  cancelButtonText: {
    color: COLORS.TEXT_COLOR_3,
  },
  logoutButton: {
    backgroundColor: COLORS.BUTTON_PRIMARY_COLOR,
    borderRadius: scale(8),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.PRIMARY_BUTTON_TEXT_COLOR,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.AIRBNB_CEREMONIAL_MEDIUM,
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
     textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    fontSize: responsiveFontSize(2.5),
    color: COLORS.TEXT_COLOR,
    fontFamily: FONTS.AIRBNB_CEREMONIAL_BOLD
  },
});


export default ProfileScreen; 