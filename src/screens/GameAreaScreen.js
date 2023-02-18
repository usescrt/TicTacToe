import { Appbar, List, TextInput, Button } from "react-native-paper";
import React, { useState, useEffect } from "react";

export default function GameAreaScreen({ route }) {
  const { userType, gameAreaID } = route.params;

  return (
    <Appbar.Header>
      <Appbar.Content title="Game Area" />
    </Appbar.Header>
  );
}
