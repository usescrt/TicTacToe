import { Appbar, Text, Surface } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { HStack } from "@react-native-material/core";
import { TouchableOpacity, View } from "react-native";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function GameAreaScreen({ route }) {
  const { userType, gameAreaID } = route.params;

  const [gameArray, setGameArray] = useState([]);

  var [whichOnePlay, setWhichOnePlay] = useState("");

  var [userMark, setUserMark] = useState("");

  var [isPlay, setIsPlay] = useState(false);

  var listenGameAreaChange;

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
    console.log(temp);

    for (let index = 0; index < temp.length; index++) {
      if (
        temp[index] !== "-" &&
        temp[index + 3] !== "-" &&
        temp[index + 6] !== "-" &&
        temp[index] === temp[index + 3] &&
        temp[index] === temp[index + 6]
      ) {
        console.log("if = 1");
        console.log("Winner!");
        return;
      }
    }

    for (let index = 0; index < temp.length; index = index + 3) {
      if (
        temp[index] !== "-" &&
        temp[index + 1] !== "-" &&
        temp[index + 2] !== "-" &&
        temp[index] === temp[index + 1] &&
        temp[index] === temp[index + 2]
      ) {
        console.log("if = 2");
        console.log("Winner!");
        return;
      }
    }

    if (
      temp[0] !== "-" &&
      temp[4] !== "-" &&
      temp[8] !== "-" &&
      temp[0] === temp[4] &&
      temp[0] === temp[8]
    ) {
      console.log("if = 3");
      console.log("Winner!");
      return;
    }

    if (
      temp[2] !== "-" &&
      temp[4] !== "-" &&
      temp[8] !== "-" &&
      temp[2] === temp[4] &&
      temp[2] === temp[8]
    ) {
      console.log("if = 4");
      console.log("Winner!");
      return;
    }

    var tempIndex = 0;

    // Check Berabere
    for (let index = 0; index < temp.length; index++) {
      if (temp[index] !== "-") {
        tempIndex++;
      }
    }

    if (tempIndex === temp.length) {
      // Reset Game
      await updateDoc(doc(db, "GameArea", gameAreaID), {
        gameArea: ["","","","","","","","",""],
        whichOnePlay: "creater",
      });
    }
  };

  const pressBox = async (index) => {
    let tempArray = [...gameArray];

    tempArray[index] = userMark;

    setWhichOnePlay(whichOnePlay === "creater" ? "join" : "creater");

    await updateDoc(doc(db, "GameArea", gameAreaID), {
      gameArea: tempArray,
      whichOnePlay: whichOnePlay === "creater" ? "join" : "creater",
    }).then(() => {
      console.log("updated");
    });
  };

  useEffect(() => {
    // Set User Mark X or O
    userType === "creater" ? setUserMark("X") : setUserMark("O");
    // Set Which one play
    setWhichOnePlay(userType);
    // Fethc Data
    fetchData();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Game Area" />
      </Appbar.Header>

      <Surface elevation={4}>
        <Text>{whichOnePlay === userType ? "Your Turn" : "Your That"}</Text>
      </Surface>

      <HStack m={4} spacing={6}>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(0)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[0]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(1)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[1]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(2)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[2]}</Text>
          </View>
        </TouchableOpacity>
      </HStack>

      <HStack m={4} spacing={6}>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(3)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[3]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(4)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[4]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(5)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[5]}</Text>
          </View>
        </TouchableOpacity>
      </HStack>

      <HStack m={4} spacing={6}>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(6)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[6]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(7)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[7]}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isPlay} onPress={() => pressBox(8)}>
          <View style={{ width: 60, height: 60, backgroundColor: "#faf089" }}>
            <Text>{gameArray[8]}</Text>
          </View>
        </TouchableOpacity>
      </HStack>
    </>
  );
}
