import React, { useState, useEffect } from "react";
import { signInAnonymously, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { Appbar, TextInput, HelperText } from "react-native-paper";
import Loading from "../components/Loading";

function HomeScreen({ navigation }) {
  // Set TextInput Data

  var [textInput, setTextInput] = useState("");

  // ...

  var [isLoading, setLoading] = React.useState(true);

  // init page

  useEffect(() => {
    // ...
    checkSignIn();
  }, []);

  // User sign in Anonymously

  const checkSignIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("Sign in");
        // Open Game List Screen
        openGameListScreen();
      } else {
        // No user is signed in.
        setLoading(false);
      }
    });
  };

  const signIn = () => {
    signInAnonymously(auth).then((result) => {
      console.log("Sign In");

      postUsernameFirestore(result.user.uid);
    });
  };

  // Post Username from Firestore

  const postUsernameFirestore = async (userUID) => {
    const docRef = await setDoc(doc(db, "Users", userUID), {
      username: textInput,
      userUID: userUID,
    }).then(() => {
      openGameListScreen();
    });
  };

  const handleDoneButton = () => {
    if (textInput.length > 2) {
      setLoading(true);
      signIn();
    }
  };

  const hasErrorsTextInput = () => {
    return textInput.length < 3;
  };

  const openGameListScreen = () => {
    // Open GameList Screen
    navigation.navigate("GameList");
  };

  // Check isLoading

  if (isLoading) return <Loading visible={isLoading} />;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Username" />
        <Appbar.Action
          icon="check"
          onPress={() => {
            handleDoneButton();
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
      <HelperText type="error" visible={hasErrorsTextInput()}>
        Must be min. 3 char!
      </HelperText>
    </>
  );
}

export default HomeScreen;
