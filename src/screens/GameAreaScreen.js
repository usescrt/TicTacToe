import { Appbar, Text, Surface, FlatList } from "react-native-paper";
import React, { useState, useEffect, useCallback } from "react";
import { HStack } from "@react-native-material/core";
import { TouchableOpacity, View } from "react-native";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function GameAreaScreen({ route }) {
  const { userType, gameAreaID, rowNumber } = route.params;

  const [gameArray, setGameArray] = useState([]);

  var [whichOnePlay, setWhichOnePlay] = useState("");

  var [userMark, setUserMark] = useState("");

  var [isPlay, setIsPlay] = useState(false);

  var listenGameAreaChange;

  // init page

  useEffect(() => {
    // Set User Mark X or O
    userType === "creater" ? setUserMark("X") : setUserMark("O");
    // Set Which one play
    setWhichOnePlay(userType);

    // Fethc Data
    fetchData();
  }, []);

  // Get Firebase Data and Listen

  const fetchData = () => {
    listenGameAreaChange = onSnapshot(
      doc(db, "GameArea", gameAreaID),
      { includeMetadataChanges: false },
      (doc) => {
        const temp = doc.data().gameArea;
        // Set Array
        setGameArray(temp);
        // Set whichOnePlay
        setWhichOnePlay(doc.data().whichOnePlay);
        // Set isPlay
        userType === doc.data().whichOnePlay
          ? setIsPlay(false)
          : setIsPlay(true);

        checkWin(temp);
      }
    );
  };

  const checkWin = async (temp) => {
    for (let index = 0; index < (rowNumber - 1) * 3; index = index + 3) {
      for (let i = index; i < 3; i++) {
        if (
          temp[i] !== "" &&
          temp[i + 3] !== "" &&
          temp[i + 6] !== "" &&
          temp[i] === temp[i + 3] &&
          temp[i] === temp[i + 6]
        ) {
          console.log("if = 1");
          console.log("Winner!");
          return;
        }
      }
    }

    for (let index = 0; index < temp.length; index = index + 3) {
      if (
        temp[index] !== "" &&
        temp[index + 1] !== "" &&
        temp[index + 2] !== "" &&
        temp[index] === temp[index + 1] &&
        temp[index] === temp[index + 2]
      ) {
        console.log("if = 2");
        console.log("Winner!");
        return;
      }
    }

    for (let index = 0; index < (rowNumber - 1) * 3; index = index + 3) {
      if (
        temp[index] !== "" &&
        temp[index + 4] !== "" &&
        temp[index + 8] !== "" &&
        temp[index] === temp[index + 4] &&
        temp[index] === temp[index + 8]
      ) {
        console.log("if = 3");
        console.log("Winner!");
        return;
      }
    }

    for (let index = 2; index < (rowNumber - 2) * 3; index = index + 3) {
      if (
        temp[index] !== "" &&
        temp[index + 2] !== "" &&
        temp[index + 4] !== "" &&
        temp[index] === temp[index + 2] &&
        temp[index] === temp[index + 4]
      ) {
        console.log("if = 4");
        console.log("Winner!");
        return;
      }
    }

    var tempIndex = 0;

    // Check Berabere
    for (let index = 0; index < temp.length; index++) {
      if (temp[index] !== "") {
        tempIndex++;
      }
    }

    if (tempIndex === temp.length) {
      // Create Game Area Array
      var createGameArea = [];

      for (let index = 0; index < parseRowNumber; index++) {
        for (let index = 0; index < 3; index++) {
          createGameArea.push("");
        }
      }
      // Reset Game
      await updateDoc(doc(db, "GameArea", gameAreaID), {
        gameArea: createGameArea,
        whichOnePlay: "creater",
      });
    }
  };

  // Press Box

  const pressBox = async (index) => {
    let tempArray = [...gameArray];

    tempArray[index] = userMark;

    setWhichOnePlay(whichOnePlay === "creater" ? "join" : "creater");

    await updateDoc(doc(db, "GameArea", gameAreaID), {
      gameArea: tempArray,
      whichOnePlay: whichOnePlay === "creater" ? "join" : "creater",
    });
  };

  const row = () => {
    let rows = [];
    for (let index = 0; index < rowNumber * 3; index = index + 3) {
      rows.push(
        <HStack m={4} spacing={6} key={index}>
          <TouchableOpacity
            disabled={isPlay}
            onPress={() => pressBox(0 + index)}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#faf089",
              }}
            >
              <Text>{gameArray[0 + index]}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isPlay}
            onPress={() => pressBox(1 + index)}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#faf089",
              }}
            >
              <Text>{gameArray[1 + index]}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isPlay}
            onPress={() => pressBox(2 + index)}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#faf089",
              }}
            >
              <Text>{gameArray[2 + index]}</Text>
            </View>
          </TouchableOpacity>
        </HStack>
      );
    }
    return rows;
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Game Area" />
      </Appbar.Header>

      <Surface elevation={4}>
        <Text>{whichOnePlay === userType ? "Your Turn" : "Your That"}</Text>
      </Surface>

      <View>{row()}</View>
    </>
  );
}
