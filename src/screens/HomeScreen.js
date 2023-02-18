import React, { useState, useEffect } from "react";
import { signInAnonymously, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { Appbar, List, TextInput, Button } from "react-native-paper";

function HomeScreen({ navigation }) {
  // Set TextInput Data
  const [textInput, setTextInput] = useState("");

  // Set Firebase UserUID

  const [userUID, setUserUID] = useState("");

  // User sign in Anonymously

  function signIn() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("Sing in");
        navigation.navigate("GameList");
      } else {
        // No user is signed in.
        signInAnonymously(auth)
          .then((result) => {
            console.log("Sing In");

            setUserUID(result.user.uid);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
            console.log(errorCode);
            console.log(errorMessage);
          });
      }
    });
  }

  // Post Username from Firestore

  async function postUsernameFirestore() {
    try {
      const docRef = await setDoc(doc(db, "Users", userUID), {
        username: textInput,
        userUID: userUID,
      }).then(() => {
        // Open GameList Screen
        navigation.navigate("GameList");
      });
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    // ...
    signIn();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Username" />
        <Appbar.Action
          icon="check"
          onPress={() => {
            postUsernameFirestore();
          }}
        />
      </Appbar.Header>

      <TextInput
        label="Username"
        onChangeText={(text) => {
          setTextInput(text);
        }}
        style={{ margin: 16 }}
      />
    </>
  );
}

export default HomeScreen;
