import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import * as Loc from "expo-location"
import { View ,Text, SafeAreaView, Keyboard, FlatList,StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-paper';



export default function Home({route}:any) {

const[data,setData]=useState()
const[currentLoc,setCurrentLoc]=useState('')
const[time,setTime]=useState('')
const [location, setLocation] = useState<Loc.LocationObject | null> (null);
const [errorMsg, setErrorMsg] = useState ("");
const[latitude,setLatitude]=useState(null)
const [longitude, setLongitude] = useState(null);
const[newLoc,setnewLoc]=useState([])

const LIMIT=30;

    useEffect(() => {
        (async () => {
          
          const { status } =  await Loc.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            console.log('no')
            return;
          }
          if(status === "granted"){
            console.log('yes')
            const location = await Loc.getCurrentPositionAsync({});
            console.log(location.coords)
            //@ts-ignore
            setLatitude(location.coords.latitude)
            console.log(location.coords.latitude)
              //@ts-ignore
            setLongitude(location.coords.longitude)
            return location;
          }
        })();
        getLocation()
        getUser()
         const interval = setInterval(() => {
           getLocation();
         }, 500000);
      
        return () => clearInterval(interval);
      }, [latitude]);
    
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
      }
    
    const getLocation =useCallback(async () => {
        try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=86607df464784a2280f2b81bcea06d58`
            )
         // console.log(response.data.timestamp.created_http)
        setData(response.data)
        console.log(response.data)
        setCurrentLoc(response.data.results[0].formatted)
        setTime(response.data.timestamp.created_http)
        storeLocation(response.data.results[0].formatted,response.data.timestamp.created_http)
        } catch (error) {
            console.log(error)
        }
      },[]);

      


const storeLocation = async (currentLoc: string | undefined,time: string | undefined) => {
  let value = [{
    name: currentLoc,
    time: time
  }]
  try {
    const savedLoc = await AsyncStorage.getItem("loc");
    const currentLoc = JSON.parse(savedLoc!);
    await AsyncStorage.setItem("loc", JSON.stringify(value.concat(currentLoc)));
    console.log(currentLoc)
  } catch (error) {
    console.log(error);
  }
};


const getUser = async () => {
  try {
    const savedLoc = await AsyncStorage.getItem("loc");
    const currentLoc = JSON.parse(savedLoc!); 
    setnewLoc(currentLoc)
    const length=currentLoc.length
    console.log(length)
    console.log(currentLoc)
    if(length == LIMIT){
      // setnewLoc(currentLoc.splice(currentLoc[-1],1))   
      const savedLoc = await AsyncStorage.getItem("loc");
      const currentLoc = JSON.parse(savedLoc!); 
      setnewLoc(currentLoc.splice( 0, length - LIMIT))
      // currentLoc.splice(0, 1);
      // currentLoc.splice(currentLoc[-1],1)
     
      getUser()
     }
  } catch (error) {
    console.log(error);
  }
};
          
      const clearStorage = async () => {
        try {
          await AsyncStorage.clear();
          setnewLoc([]);
          alert("Previous Locations successfully cleared!");
        } catch (e) {
          alert("Failed to clear the Previous Locations.");
        }
      };
      
     const removeLoc= async (key: any)=>{
        try {
          const savedLoc = await AsyncStorage.getItem("loc");
          const currentLoc = JSON.parse(savedLoc!); 
          const filteredLoc= currentLoc.filter((item: any,index: any)=>index !==key)
          console.log(key)
          await AsyncStorage.setItem("loc", JSON.stringify(filteredLoc));
          console.log(filteredLoc)
          getUser()
            return true;
        }
        catch(error) {  
          console.log(error)
            return false;
        }
    }
      
  return (
    <><SafeAreaView>
      {data ? (
        <>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginTop: 10,
                color: "gray",
              }}
            >
              Current Location
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginTop: 20,
                color: "black",
              }}
            >
              {currentLoc}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "black" }}>
              {time}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginTop: 30,
                color: "gray",
              }}
            >
              Previous Locations
            </Text>
          </View>
          {/* {newLoc  && (
          <View>
          {newLoc.map((item:any,key:number)=>(
            <View>
             <Text> {newLoc[0].name}</Text>
             <Text> {newLoc[0].time}</Text>
            </View>
         ))}
        </View>
         ) } */}
          {/* <TouchableOpacity onPress={() => {
  
  Linking.openURL(
  
    `https://www.google.com/maps/dir/?api=1&destination=latitude,longitude&dir_action=navigate`
  
  ); */}
          <FlatList
            data={newLoc}
            renderItem={({ item, index }) => (
              <View>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ margin: 20, marginLeft: 0 }}>

                    <Text> {newLoc[0].name}</Text>
                    <Text> {newLoc[0].time}</Text>
                  </View>
                  {/* <Button title="clear" onPress={removeLoc}></Button> */}
                  <View
                    style={{
                      margin: 20,
                      marginLeft: 0,
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      mode="contained"
                      contentStyle={{
                        height: 40,
                        width: 100,
                      }}
                      // labelStyle={{ }}
                      onPress={() => removeLoc(index)}
                    >
                      Remove
                    </Button>
                  </View>
                </View>
              </View>
            )} />
        </>
      ) : null}

    </SafeAreaView><View style={{
      right: 10,
      left: 10,
      position: 'absolute',
      bottom: 80,
    }}>
        <Button
          style={styles.button}
          mode="contained"
          contentStyle={{
            height: 50,
          }}
          // labelStyle={{ }}
          onPress={clearStorage}
        >
          Clear All
        </Button></View></>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: 'orange',
    borderRadius: 4,
textAlign:'center',


  },
  buttonText: {
    fontSize: 18,
    color: '#444',
  },
});
