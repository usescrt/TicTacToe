import { Appbar, List, TextInput, Button } from "react-native-paper";
import {
  addDoc,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { async } from "@firebase/util";
import { useState } from "react";

export default function GameCreateScreen({ navigation }) {
  // ...

  var gameAreaDocID = "";

  // ...

  var unsubscribeListenMatch;

  // Create Game Area from server

  async function postGameAreaFirestore() {
    // ...
    await addDoc(collection(db, "GameArea"), {
      isMatch: false,
    }).then((docRef) => {
      gameAreaDocID = docRef.id;
      postGameListFirestore(docRef.id);
      // Start Listen isMatch
      listenMatch();
    });
  }

  // ...

  async function postGameListFirestore(docID) {
    await setDoc(doc(db, "GameList", docID), {
      gameAreaID: docID,
    });
  }

  // ...

  async function deleteGameArea() {
    await deleteDoc(doc(db, "GameArea", gameAreaDocID));
    await deleteDoc(doc(db, "GameList", gameAreaDocID));
  }

  // Listen Game Area isMatch

  function listenMatch() {
    unsubscribeListenMatch = onSnapshot(
      doc(db, "GameArea", gameAreaDocID),
      { includeMetadataChanges: true },
      (doc) => {
        if (doc.data().isMatch === true) {
          // Open Game Area
          navigation.navigate("GameArea");
        }
      }
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            // Remove Listener ListenMatch
            unsubscribeListenMatch();
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
