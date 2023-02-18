import { Appbar, List, TextInput, Button } from "react-native-paper";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import React, { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { FlatList } from "react-native";

class GList {
  constructor(gameAreaID) {
    this.gameAreaID = gameAreaID;
  }
}

export default function GameListScreen({ navigation }) {
  // Game List Array

  const [gameListArray, setGameListArray] = useState();

  // Game List from firestore

  function gameListFirestore() {
    onSnapshot(collection(db, "GameList"), (doc) => {
      const tempArray = [];
      doc.docChanges().forEach((item) => {
        temp = new GList(item.doc.data().gameAreaID);
        tempArray.push(temp);

        // if remove game area, remove from array
        if (item.type === "removed") {
          const findIndex = tempArray.findIndex(
            (a) => a.gameAreaID === item.doc.data().gameAreaID
          );
          tempArray.splice(findIndex, 1);
        }
        setGameListArray(tempArray);
      });
    });
  }

  // init Screen

  useEffect(() => {
    // ...
    gameListFirestore();
  }, []);

  renderItem = ({ item, index }) => {
    return (
      <List.Item
        title={item.gameAreaID}
        description="Item description"
        left={(props) => <List.Icon {...props} icon="folder" />}
      />
    );
  };

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
