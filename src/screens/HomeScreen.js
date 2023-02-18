import React, { useState, useEffect } from "react";
import { signInAnonymously, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import {
  Appbar,
  TextInput,
  Button,
  Dialog,
  Portal,
  Provider,
  Text,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";

function HomeScreen({ navigation }) {
  // Set TextInput Data

  var [textInput, setTextInput] = useState("");

  // ...

  var [visible, setVisible] = React.useState(true);

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
        setVisible(false);
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
      setVisible(false);
      openGameListScreen();
    });
  };

  const handleDoneButton = () => {
    if (textInput.length > 2) {
      setVisible(true);
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

  if (visible)
    return (
      <Provider visible={true}>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Content>
              <ActivityIndicator size={"large"} />
            </Dialog.Content>
          </Dialog>
        </Portal>
      </Provider>
    );

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
