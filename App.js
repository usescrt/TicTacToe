import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import GameListScreen from "./src/screens/GameListScreen";
import GameCreateScreen from "./src/screens/GameCreateScreen";
import GameAreaScreen from "./src/screens/GameAreaScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GameList" component={GameListScreen} />
        <Stack.Screen name="GameCreate" component={GameCreateScreen} />
        <Stack.Screen name="GameArea" component={GameAreaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
