import { Appbar, List, TextInput, Button } from "react-native-paper";
import { onSnapshot, doc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import React, { useState, useEffect, useCallback } from "react";
import { async } from "@firebase/util";
import { FlatList, TouchableOpacity } from "react-native";

class GList {
  constructor(gameAreaID) {
    this.gameAreaID = gameAreaID;
  }
}

export default function GameListScreen({ navigation }) {
  // Game List Array

  const [gameListArray, setGameListArray] = useState([]);

  var unsubscribeGameList;

  const removeGameArea = (temp) => {
    setGameListArray((prevState) =>
      prevState.filter((item) => item.gameAreaID !== temp.gameAreaID)
    );
  };

  // Game List from firestore

  const gameListFirestore = () => {
    unsubscribeGameList = onSnapshot(collection(db, "GameList"), (doc) => {
      doc.docChanges().forEach((item) => {
        const temp = new GList(item.doc.data().gameAreaID);

        // if add game area, added from array

        if (item.type === "added") {
          setGameListArray((prevState) => [...prevState, temp]);
        }

        // if remove game area, remove from array
        if (item.type === "removed") {
          removeGameArea(temp);
        }
      });
    });
  };

  const setMatchFromFirebase = async (gameAreaID) => {
    await updateDoc(doc(db, "GameArea", gameAreaID), {
      isMatch: true,
    }).then(() => {
      // Open Game Area Screen
      navigation.navigate("GameArea", {
        userType: "join",
        gameAreaID: gameAreaID,
      });
    });
  };

  // init Screen

  useEffect(() => {
    // ...
    gameListFirestore();
  }, []);

  renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          // Set Match
          setMatchFromFirebase(item.gameAreaID);
        }}
      >
        <List.Item
          title={item.gameAreaID}
          description="Item description"
          left={(props) => <List.Icon {...props} icon="folder" />}
        />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Game List" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("GameCreate");
          }}
        />
      </Appbar.Header>
      <FlatList data={gameListArray} renderItem={renderItem} />
    </>
  );
}
