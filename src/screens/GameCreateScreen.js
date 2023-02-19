import { Appbar, TextInput, HelperText } from "react-native-paper";
import {
  addDoc,
  doc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";

/*
GameArea Firestore Template Data
{
  gameArea: ["","","","","","","","",""],
  isMatch: false,
  whichOnePlay: "creater",
  createrName: "Murat",
  joinName: "Hasan" ====> this data update from join user
  rowNumber: "3"
}
*/

/*
Game List Firestore Template Data
{
  gameAreaID: "dsadsadsadsadsadsa",
  listType: "open" ====> "open" or or "gaming" or "complatedGame"
  createrName: "Murat"
  joinName: "Hasan" ====> this data update from join user
  rowNumber: "3"
}
*/

export default function GameCreateScreen({ navigation }) {
  // Row number

  var [textInputRowNumber, setTextInputRowNumber] = useState("");

  // ...

  var [isLoading, setLoading] = React.useState(false);

  // Firestore GameArea Doc Id

  var gameAreaDocID = "";

  // ListenMatch firebase listener // if create game area then close page remove game area

  var unsubscribeListenMatch;

  // Get Username from firestore then post game area

  const getUsernameFromFirestore = async () => {
    // Get UserUID
    const tempUserUID = auth.currentUser.uid;
    const docRef = doc(db, "Users", tempUserUID);
    await getDoc(docRef).then((result) => {
      const tempUsername = result.data().username;
      postGameAreaFirestore(tempUsername);
    });
  };

  // Post GameArea from server

  const postGameAreaFirestore = async (username) => {
    const parseRowNumber = parseInt(textInputRowNumber);

    var createGameArea = [];

    for (let index = 0; index < parseRowNumber; index++) {
      for (let index = 0; index < 3; index++) {
        createGameArea.push("");
      }
    }

    // ...
    await addDoc(collection(db, "GameArea"), {
      isMatch: false,
      gameArea: createGameArea,
      whichOnePlay: "creater",
      createrName: username,
      rowNumber: parseRowNumber,
    }).then((docRef) => {
      gameAreaDocID = docRef.id;
      // Post game list doc
      postGameListFirestore(docRef.id, username);
      // Start Listen isMatch
      listenMatch();
    });
  };

  // Post GameList doc

  async function postGameListFirestore(docID, username, rowNumber) {
    await setDoc(doc(db, "GameList", docID), {
      gameAreaID: docID,
      listType: "open",
      createrName: username,
      rowNumber: parseInt(textInputRowNumber)
    });
  }

  // Delete GameList and Game Area doc

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
          setLoading(false);
          // Open Game Area
          navigation.navigate("GameArea", {
            userType: "creater",
            gameAreaID: gameAreaDocID,
            rowNumber: parseInt(textInputRowNumber),
          });
        }
      }
    );
  }

  const hasErrorsTextInput = () => {
    if (parseInt(textInputRowNumber) < 3) return true;
    else false;
  };

  const handleDoneButton = () => {
    if (parseInt(textInputRowNumber) > 2) {
      setLoading(true);
      getUsernameFromFirestore();
    }
  };

  if (isLoading) return <Loading visible={isLoading} />;

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            // Remove Listener ListenMatch
            unsubscribeListenMatch();
            // Remove Game Area From Firestore
            if (gameAreaDocID !== "") deleteGameArea();
            // Go Back Game List Screen
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Game Create" />
        <Appbar.Action
          icon="check"
          onPress={() => {
            // Get username then create doc GameArea
            handleDoneButton();
          }}
        />
      </Appbar.Header>
      <TextInput
        label="Row Number"
        onChangeText={(text) => {
          setTextInputRowNumber(text);
        }}
        style={{ margin: 16 }}
      />
      <HelperText type="error" visible={hasErrorsTextInput()}>
        Must be min. 3 row!
      </HelperText>
    </>
  );
}
