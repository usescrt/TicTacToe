import { Text } from "@react-native-material/core";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import React, { useEffect } from "react";

function HomeScreen() {
  // User sıgn in Anonymously

  function signIn() {
    signInAnonymously(auth)
      .then(() => {
        console.log("Sing In");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        console.log(errorCode);
        console.log(errorMessage);
      });
  }

  useEffect(() => {
    // ...
    signIn();
  }, []);

  return (
    <>
      <Text>Home Screen</Text>
    </>
  );
}

export default HomeScreen;
