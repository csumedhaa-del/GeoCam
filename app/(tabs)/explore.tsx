import { View, Text, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { Alert } from 'react-native';

export default function ExploreScreen() {
  console.log("EXPLORE SCREEN LOADED");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  console.log(selectedImage);
  useFocusEffect(
  useCallback(() => {
    const loadRecords = async () => {
      const data = await AsyncStorage.getItem('records');

      if (data) {
        setRecords(JSON.parse(data));
      }

      console.log("HISTORY DATA:");
      console.log(JSON.parse(data || '[]'));
    };

    loadRecords();
  }, [])
);
  console.log(records.length);

  const deleteRecord = async (id: number) => {
    
  const updatedRecords = records.filter(
    (record) => record.id !== id
  );

  setRecords(updatedRecords);

  await AsyncStorage.setItem(
    'records',
    JSON.stringify(updatedRecords)
  );
};

  return (
  <ScrollView
  style={{
    flex: 1,
    backgroundColor: '#0D1117',
  }}
>
  <View
    style={{
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 15,
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
      }}
    >
      History
    </Text>

    <Text
      style={{
        color: '#8B949E',
        fontSize: 16,
        marginTop: 4,
      }}
    >
      Total Records: {records.length}
    </Text>
  </View>
  {records.length === 0 ? (
  <View
    style={{
      alignItems: 'center',
      marginTop: 100,
    }}
  >
    <Text
      style={{
        color: '#8B949E',
        fontSize: 18,
      }}
    >
      No records yet
    </Text>

    <Text
      style={{
        color: '#6E7681',
        marginTop: 8,
      }}
    >
      Capture a photo to get started
    </Text>
  </View>
) : (
  [...records]
  .sort(
    (a: any, b: any) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )
  
  .map((record: any) => (
  
  <View
  key={record.id}
  style={{
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#21262D',
    alignItems: 'center',
  }}
>
  <TouchableOpacity
  onPress={() => setSelectedImage(record.imageUri)}
>
  <Image
    source={{ uri: record.imageUri }}
    style={{
      width: 100,
      height: 100,
      borderRadius: 10,
    }}
  />
</TouchableOpacity>

  <View
    style={{
      flex: 1,
      marginLeft: 15,
    }}
  >
    <Text style={{ color: 'white', marginBottom: 5 }}>
      {new Date(record.timestamp).toLocaleString()}
    </Text>

    <Text style={{ color: '#C9D1D9' }}>
      Lat: {record.latitude.toFixed(6)}
    </Text>

    <Text style={{ color: '#C9D1D9' }}>
      Lng: {record.longitude.toFixed(6)}
    </Text>
    <TouchableOpacity
    onPress={() => Alert.alert(
  "Delete Record",
  "Are you sure you want to delete this record?",
  [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => deleteRecord(record.id),
    },
  ]
)}
    >
      <Fontisto
      name="trash"
      size={20}
      color="#ff6b6b"
      />
      </TouchableOpacity>
      </View>
      </View>
    )))}
  

<Modal
  visible={selectedImage !== null}
  transparent={true}
  animationType="fade"
>
  <TouchableOpacity
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => setSelectedImage(null)}
  >
    <Image
      source={{ uri: selectedImage || '' }}
      style={{
        width: '90%',
        height: '70%',
      }}
      resizeMode="contain"
    />
  </TouchableOpacity>
</Modal>

    </ScrollView>
    );
  }