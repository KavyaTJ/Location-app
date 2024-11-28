
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';


const MapViewLoc = () => {
  
  const[latitude,setLatitude]=useState(null)
  const [longitude, setLongitude] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  useEffect(() => {
     (async () => {
       let location = await Location.getCurrentPositionAsync({});
       setMapRegion({
        //@ts-ignore
           longitude: location.coords.longitude,
           latitude: location.coords.latitude,
           longitudeDelta: 0.0922,
           latitudeDelta: 0.0421
         });
         
         console.log('location', location)
     })();
   }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        //@ts-ignore
        initialRegion={mapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            longitude: longitude ? longitude : 0,
            latitude: latitude ? latitude : 0,
          }}
        ></Marker>
      </MapView>
    </View>
  );
};
export default MapViewLoc;



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});