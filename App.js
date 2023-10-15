import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      setPhotoUri(photo.uri);
      await AsyncStorage.setItem("savedPhoto", photo.uri);
    }
  };

  const getPhotoFromStorage = async () => {
    const uri = await AsyncStorage.getItem("savedPhoto");
    if (uri) {
      setPhotoUri(uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {hasPermission === null ? (
          <Text>Requesting Camera Permission...</Text>
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <View style={styles.cameraContainer}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.preview} />
            ) : (
              <Camera
                style={styles.camera}
                type={type}
                ref={(ref) => (camera = ref)}
              />
            )}
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {photoUri ? (
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Another Picture</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={getPhotoFromStorage}>
          <Text style={styles.buttonText}>Get Photo from AsyncStorage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
