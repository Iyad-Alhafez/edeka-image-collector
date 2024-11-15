import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import uuid from 'react-native-uuid';
import { Button } from '@/components/Button';
import { ImageItem } from '../models';
import {
  getDBConnection, 
  createTable,
  createDummyData,
  deleteTable,
  getImageItems,
  saveImageItem
} from '../db/db-service';

export default function Index() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isCaptureButtonPressed, setIsCaptureButtonPressed] = useState(false);
  const [isNewButtonPressed, setIsNewButtonPressed] = useState(false);
  const [productId, setProductId] = useState(uuid.v4() as string);
  const [imageNo, setImageNo] = useState(1);
  const db = getDBConnection();

  useEffect ( () => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      await deleteTable(await db);
      await createTable(await db);
      // await createDummyData(await db);
    })();
  }, []);

  useEffect ( () => {
    if(!isFirstVisit && image){
      saveImageInDB(image, 1);
    }
  }, [productId]);

  useEffect (() => {
    if(isCaptureButtonPressed || isNewButtonPressed) takePicture();
  }, [isCaptureButtonPressed, isNewButtonPressed]);

  useEffect (() => {
    if(image){
      if(isCaptureButtonPressed) {
        savePicture().then(() => setImageNo(imageNo + 1));
      } else if(isNewButtonPressed) {
        savePicture().then(() => setImageNo(2));
      }
    }
  }, [image]);

  const takePicture = async () => {
    if(cameraRef) {
      try{
        console.log("Picture was Taken!");
        // const options = { quality: 0.5, base64: true, skipProcessing: true };
        const data = await (cameraRef.current as any).takePictureAsync();
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }

  const savePicture = async () => {
    setIsFirstVisit(false);
    if(image) {
      try{
        await MediaLibrary.createAssetAsync(image);
        
        if(isCaptureButtonPressed) {
          saveImageInDB(image);
        } else if(isNewButtonPressed) {
          setProductId(uuid.v4() as string);
        }

      } catch(e) {
        console.log(e);
      }
    }
  }

  const saveImageInDB = async (imageUri: string, initialCounter?: number) => {
    await saveImageItem(await db, productId, initialCounter? initialCounter : imageNo, imageUri);
    const storedImageItems = await getImageItems(await db);
    console.log(storedImageItems);
    console.log("Picture Saved!");
    setImage(null);
    setIsCaptureButtonPressed(false);
    setIsNewButtonPressed(false);
  }

  if(!hasCameraPermission) {
    return <Text>No Access!</Text>
  }

  return (
    <View style={styles.container}>
      <CameraView
          style={styles.camera}
          facing={'back'}
          ref={cameraRef}/>
      <View style={styles.footer}>
        
          <View>
            <Button icon="circle" onPress={() => setIsCaptureButtonPressed(true)}/>
            <View style={styles.newButton}>
              <Button icon="plus" disabled={isFirstVisit} onPress={() => setIsNewButtonPressed(true)}/>
            </View>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '15%',
  },
  newButton: {
    position: 'absolute',
    right: 15,
  },
});
