import React, { useState } from "react";
import {
  Dialog,
  Portal,
  Provider,
  ActivityIndicator,
} from "react-native-paper";

export default function Loading(props) {
  // ...

  var [visible, setVisible] = useState(true);

  return (
    <Provider visible={props.visible}>
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Content>
            <ActivityIndicator size={"large"} />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Provider>
  );
}
