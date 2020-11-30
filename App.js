import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Header from "./components/Header";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';


const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};




export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [guessRound, setGuessRound] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  const configureNewGameHandler = () => {
    setGuessRound(0);
    setUserNumber(null);
  };

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
    setGuessRound(0);

  };

  const gameOverHandler = numOfRounds => {
    setGuessRound(numOfRounds);
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  let content = <StartGameScreen onStartGame={startGameHandler} />;
  if (userNumber && guessRound <= 0) {
    content = <GameScreen userChoice={userNumber} onGameover={gameOverHandler} />;
  } else if (guessRound > 0) {
    content = <GameOverScreen roundsNumber={guessRound} userNumber={userNumber} onRestart={configureNewGameHandler} />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Guess a Number" />
      {content}
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }

});
