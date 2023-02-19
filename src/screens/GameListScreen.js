import { Appbar, List } from "react-native-paper";
import {
  onSnapshot,
  doc,
  collection,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import GameListModel from "../models/GameListModel";

/*
Game List Firestore Template Data
{
  gameAreaID: "dsadsadsadsadsadsa",
  userTurn: "creater", ====> "creater" or "join"
  listType: "open" ====> "open" or or "gaming" or "complatedGame"
  createrName: "Murat"
  joinName: "Hasan" ====> this data update from join user
}
*/

export default function GameListScreen({ navigation }) {
  // Game List Array

  const [gameListArray, setGameListArray] = useState([]);

  var unsubscribeGameList;

  // init Screen

  useEffect(() => {
    // ...
    gameListFirestore();
  }, []);

  // Game List from firestore

  const gameListFirestore = () => {
    unsubscribeGameList = onSnapshot(collection(db, "GameList"), (doc) => {
      doc.docChanges().forEach((item) => {
        const temp = new GameListModel(
          item.doc.data().gameAreaID,
          item.doc.data().listType,
          item.doc.data().createrName
        );

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

  // Get Username from firestore then post Match and username

  const getUsernameFromFirestore = async (gameAreaID) => {
    // Get UserUID
    const tempUserUID = auth.currentUser.uid;
    const docRef = doc(db, "Users", tempUserUID);
    await getDoc(docRef).then((result) => {
      const tempUsername = result.data().username;
      setMatchFromFirebase(gameAreaID, tempUsername);
    });
  };

  // Set Users Match Firestore

  const setMatchFromFirebase = async (gameAreaID, username) => {
    await updateDoc(doc(db, "GameArea", gameAreaID), {
      isMatch: true,
      joinUsername: username,
      listType: "gaming",
    }).then(() => {
      // Open Game Area Screen
      navigation.navigate("GameArea", {
        userType: "join",
        gameAreaID: gameAreaID,
      });
    });
  };

  // Remove game area from firestore

  const removeGameArea = (temp) => {
    setGameListArray((prevState) =>
      prevState.filter((item) => item.gameAreaID !== temp.gameAreaID)
    );
  };

  // Flatlist render

  renderItem = useCallback(({ item }) => {
    if (item.listType === "open") {
      return (
        <TouchableOpacity
          onPress={() => getUsernameFromFirestore(item.gameAreaID)}
        >
          <List.Item
            title={item.createrName}
            description="Open Game"
            left={(props) => <List.Icon {...props} icon="gamepad-variant" />}
            right={(props) => <List.Icon {...props} icon="arrow-right" />}
          />
        </TouchableOpacity>
      );
    } else if (item.listType === "complatedGame") {
      return (
        <List.Item
          title={item.gameAreaID}
          description="Open Game"
          left={(props) => <List.Icon {...props} icon="gamepad-variant" />}
          right={(props) => <List.Icon {...props} icon="arrow-right" />}
        />
      );
    }
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Game List" />
        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate("GameCreate")}
        />
      </Appbar.Header>
      <FlatList data={gameListArray} renderItem={renderItem} />
    </>
  );
}
