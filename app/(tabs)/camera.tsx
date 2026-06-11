import PhotosPreview from '@/components/PhotosPreview';
import { AntDesign } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
console.log(FileSystem);

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] =useState<any>(null);
  const cameraRef  =useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  
  const handleTakePhoto =  async () => {
    if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takedPhoto);
    }
  }; 

  const handleRetakePhoto = () => setPhoto(null);
  const testLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    console.log("Permission status:", status);

    if (status !== 'granted') {
      console.log('Location permission denied');
      return;
    }

    console.log("Getting location...");

    const location = await Location.getCurrentPositionAsync({});
    

    console.log("LOCATION:");
    console.log(location);
  } catch (error) {
    console.log("ERROR:");
    console.log(error);
  }
};

const handleSavePhoto = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    console.log("Location permission denied");
    return;
  }
  const newPath =
  `${FileSystem.documentDirectory}${Date.now()}.jpg`;
  
  await FileSystem.copyAsync({
  from: photo.uri,
  to: newPath,
  });

  const location = await Location.getCurrentPositionAsync({});
  const record = {
  id: Date.now(),
  imageUri: newPath,
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  timestamp: new Date().toISOString(),
  };
  const existingRecords = await AsyncStorage.getItem('records');

  const records = existingRecords
  ? JSON.parse(existingRecords)
  : [];
  records.push(record);

  await AsyncStorage.setItem(
  'records',
  JSON.stringify(records)
 );

  const savedRecords = await AsyncStorage.getItem('records');
  console.log("FROM STORAGE:");
  console.log(savedRecords);
  console.log("Saved!");
  setPhoto(null);
};

  if (photo) return <PhotosPreview photo={photo} handleRetakePhoto={handleRetakePhoto} handleSavePhoto={handleSavePhoto} />


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <AntDesign name= 'retweet' size={44} color= 'black'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <AntDesign name= 'camera' size={44} color= 'black'/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius :10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
