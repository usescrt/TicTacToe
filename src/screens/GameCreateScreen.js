import { Appbar, List, TextInput, Button } from "react-native-paper";
import { addDoc, doc, collection, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { async } from "@firebase/util";
import { useState } from "react";

export default function GameCreateScreen({ navigation }) {
  // ...

  const [gameAreaDocID, setGameAreaDocID] = useState();

  // Create Game Area from server

  async function postGameAreaFirestore() {
    // ...
    await addDoc(collection(db, "GameArea"), {
      isMatch: false,
    }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      setGameAreaDocID(docRef.id);
      postGameListFirestore(docRef.id);
    });
  }

  // ...

  async function postGameListFirestore(docID) {
    setDoc(doc(db, "GameList", docID), {
      gameAreaID: docID,
    }).then(() => {
      // Open GameList Screen
    });
  }

  // ...

  async function deleteGameArea() {
    await deleteDoc(doc(db, "GameArea", gameAreaDocID));
    await deleteDoc(doc(db, "GameList", gameAreaDocID));
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            // Go Back Game List Screen
            navigation.goBack();
            // Remove Game Area From Firestore
            deleteGameArea();
          }}
        />
        <Appbar.Content title="Game Create" />
        <Appbar.Action
          icon="check"
          onPress={() => {
            postGameAreaFirestore();
          }}
        />
      </Appbar.Header>
    </>
  );
}
