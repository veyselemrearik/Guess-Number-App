import React from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableWithoutFeedback, Keyboard, Alert, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import BodyText from "../components/BodyText";
import Cards from '../components/Cards';
import Colors from '../constants/Colors';
import Input from '../components/Input';
import NumberContainer from '../components/NumberContainer';
import MainButton from '../components/MainButton';
import { useState, useEffect } from 'react';
import TitleText from '../components/TitleText';

const StartGameScreen = props => {
    const [enteredValue, setEnteredValue] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState('');
    const [buttonWidth, setButtonWidth] = useState(Dimensions.get('window').width / 4);

    useEffect(() => {
        const updateLayout = () => {
            setButtonWidth(Dimensions.get('window').width / 4);
        };

        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.addEventListener('change', updateLayout);
        };
    }, [setButtonWidth]);



    const numberInputHandler = inputText => {
        setEnteredValue(inputText.replace(/[^0-9]/g, ''));
    };

    const resetInputHandler = () => {
        setEnteredValue('');
        setConfirmed(false);

    };
    const confirmInputHandler = () => {
        const chosenNumber = parseInt(enteredValue);
        if (isNaN(chosenNumber) || chosenNumber <= 0) {

            Alert.alert('Invalid Number!!', 'Number has to be a number betwen 1 and 99', [{ text: 'Okey', style: 'destructive', onPress: resetInputHandler }])
            return;
        }
        setConfirmed(true);
        setSelectedNumber(chosenNumber);
        setEnteredValue('');
        Keyboard.dismiss();

    };
    let confirmOutput;
    if (confirmed) {
        confirmOutput = (
            <Cards style={styles.summaryContainer}>
                <BodyText>You selected</BodyText>
                <NumberContainer>{selectedNumber}</NumberContainer>
                <MainButton onPress={() => props.onStartGame(selectedNumber)} > START GAME</MainButton>
            </Cards>

        )
    }
    return (
        <ScrollView>
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                }}>


                    <View style={styles.screen}>
                        <TitleText style={styles.title}>Start a New Game!</TitleText>
                        <Cards style={styles.inputContainer}>
                            <BodyText >Select a Number</BodyText>
                            <Input
                                style={styles.input}
                                blurOnSubmit
                                autoCapitalze='none'
                                autoCorret={false}
                                keyboardType="number-pad"
                                maxLength={2}
                                onChangeText={numberInputHandler}
                                value={enteredValue} />
                            <View style={styles.buttonContainer}>
                                <View style={{ width: buttonWidth }}><Button title="Reset" onPress={resetInputHandler} color={Colors.lilaSevdasi} /></View>
                                <View style={{ width: buttonWidth }}><Button title="Confirm" onPress={confirmInputHandler} color={Colors.primary} /></View>
                            </View>
                        </Cards>
                        {confirmOutput}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center',


    },

    title: {

        fontSize: 20,
        marginVertical: 10,



    },

    inputContainer: {
        width: '80%',
        maxWidth: '95%',
        minWidth: 300,
        alignItems: 'center',


    },


    buttonContainer: {

        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 15


    },
    //  button: {
    //width: 100,
    //width: Dimensions.get('window').width / 4
    //},
    input: {
        width: 50,
        textAlign: 'center'
    },
    summaryContainer: {
        marginTop: 20,
        alignItems: 'center'


    },






});
export default StartGameScreen;