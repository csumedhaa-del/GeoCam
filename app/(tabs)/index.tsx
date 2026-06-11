import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import { ScrollView } from 'react-native';
import { Dimensions, Linking } from 'react-native';

const { width } = Dimensions.get('window');
export default function HomeScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useFocusEffect(
  useCallback(() => {
    const loadRecords = async () => {
      const data = await AsyncStorage.getItem('records');

      if (data) {
        setRecords(JSON.parse(data));
      }
    };

    loadRecords();
  }, [])
);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D1117',
      }}
    >
      <Text
  style={{
    color: 'white',
    fontSize: 24,
  }}
>
  Gallery ({records.length})
</Text>
<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }}
>
  {[...records]
  .sort(
    (a: any, b: any) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  )
  .map((record: any) => (
    <TouchableOpacity
  key={record.id}
  onPress={() => {
  setSelectedRecord(record);
  setSelectedIndex(
    [...records]
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      )
      .findIndex((r: any) => r.id === record.id)
  );
}}
>
  <Image
    source={{ uri: record.imageUri }}
    style={{
      width: 110,
      height: 110,
      margin: 5,
      borderRadius: 10,
    }}
  />
</TouchableOpacity>
  ))}
</View>
<Modal
  visible={selectedRecord !== null}
  transparent={true}
  animationType="fade"
>
  <View
  style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
    {selectedRecord && (
      <>
      <TouchableOpacity
  onPress={() => setSelectedRecord(null)}
  style={{
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 100,
    padding: 10,
  }}
>
  <Text
    style={{
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    }}
  >
    ✕
  </Text>
</TouchableOpacity>
        <ScrollView
  horizontal
  pagingEnabled
  contentContainerStyle={{
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
}}
  snapToInterval={width}
  showsHorizontalScrollIndicator={false}
  contentOffset={{
  x: selectedIndex * width,
  y: 0,
  }}
  onMomentumScrollEnd={(event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x /
      event.nativeEvent.layoutMeasurement.width
    );

    const sortedRecords = [...records].sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );

    setSelectedRecord(sortedRecords[index]);
  }}
>
  {[...records]
    .sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .map((record: any) => (
      
      <Image
        key={record.id}
        source={{ uri: record.imageUri }}
        style={{
          width: width,
          height: '80%',
        }}
        resizeMode="contain"
      />
    ))}
</ScrollView>

        <View
          style={{
            position: 'absolute',
            bottom: 40,
            width: '90%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            }}
            >
              
  Record Details
</Text>
          <Text style={{ color: 'white' }}>
            Latitude: {selectedRecord.latitude.toFixed(6)}
          </Text>

          <Text style={{ color: 'white' }}>
            Longitude: {selectedRecord.longitude.toFixed(6)}
          </Text>
          <Text
  style={{
    color: '#C9D1D9',
    marginTop: 10,
  }}
>
  Captured:
</Text>

<Text
  style={{
    color: 'white',
    marginBottom: 10,
  }}
>
  {new Date(selectedRecord.timestamp).toLocaleString()}
</Text>

          
          <TouchableOpacity
          onPress={() => {
    Linking.openURL(
      `https://www.google.com/maps?q=${selectedRecord.latitude},${selectedRecord.longitude}`
    );
  }}
  style={{
    marginTop: 10,
    backgroundColor: '#238636',
    padding: 10,
    borderRadius: 8,
  }}
>
  <Text
    style={{
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    }}
  >
    View on Map
  </Text>
</TouchableOpacity>
        </View>
      </>
    )}
  </View>
</Modal>
    </View>
  );
}