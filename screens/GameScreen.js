import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Dimensions, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import NumberContainer from '../components/NumberContainer';
import Cards from '../components/Cards';
import MainButton from '../components/MainButton';
import defaultStyles from '../constants/default-styles';
import BodyText from '../components/BodyText';
import Colors from '../constants/Colors';


const generateRandoBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min) + min);
    if (rndNum === exclude) {
        Math.floor(generateRandoBetween(min, max, exclude));
    } else {
        return rndNum;
    }
};

const renderListItem = (listLength, itemData) =>
    (<View style={styles.listItem}>
        <BodyText>#{listLength - itemData.index}</BodyText>
        <BodyText>{itemData.item}</BodyText>
    </View>);


const GameScreen = props => {
    // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);


    const initialGuess = generateRandoBetween(1, 100, props.userChoice);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
    const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
    const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);
    const { userChoice, onGameover } = props;

    useEffect(() => {
        const updateLayout = () => {
            setAvailableDeviceWidth(Dimensions.get('window').width);
            setAvailableDeviceHeight(Dimensions.get('window').height);
        };

        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.addEventListener('change', updateLayout);
        };
    }, [setAvailableDeviceWidth, setAvailableDeviceHeight]);

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameover(pastGuesses.length);
        }
    }, [currentGuess, userChoice, onGameover]);

    const nextGuessHandler = direction => {
        if ((direction === 'lower' && currentGuess < props.userChoice) || (direction === 'greater' && currentGuess > props.userChoice)) {
            Alert.alert("Dont lie!", 'You know that this is wrong..', [{ text: 'cancel', style: 'cancel' }]);
            return;
        }

        if (direction === 'lower') {
            currentHigh.current = currentGuess;
        } else {
            currentLow.current = currentGuess + 1;

        }
        const nextNumber = generateRandoBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        //SetRounds(curRounds => curRounds + 1);
        setPastGuesses(curPastGuesses => [nextNumber.toString(), ...curPastGuesses]);

    };

    let listContainerStyle = styles.listContainer;
    if (availableDeviceWidth < 350) {
        listContainerStyle = styles.listContainerBig;
    }

    if (availableDeviceHeight < 500) {
        return (
            <View style={styles.screen}>
                <Text style={defaultStyles.title}>Opponet's Guess</Text>
                <View style={styles.control}>
                    <MainButton onPress={nextGuessHandler.bind(this, 'lower')} ><Ionicons name="md-remove" size={25} color="white" /></MainButton>
                    <NumberContainer>{currentGuess}</NumberContainer>
                    <MainButton onPress={nextGuessHandler.bind(this, 'greater')} ><Ionicons name="md-add" size={25} color="white" /></MainButton>
                </View>
                <View style={listContainerStyle}>
                    {/*<ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index) => renderItem(guess, pastGuesses.length - index))}
                </ScrollView>*/}
                    <FlatList
                        keyExtractor={(item) => item}
                        data={pastGuesses}
                        renderItem={renderListItem.bind(this, pastGuesses.length)}
                        contentContainerStyle={styles.list}
                    />

                </View>

            </View>


        );
    }

    return (
        <View style={styles.screen}>
            <Text style={defaultStyles.title}>Opponet's Guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Cards style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')} ><Ionicons name="md-remove" size={25} color="white" /></MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')} ><Ionicons name="md-add" size={25} color="white" /></MainButton>
            </Cards>
            <View style={listContainerStyle}>
                {/*<ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index) => renderItem(guess, pastGuesses.length - index))}
                </ScrollView>*/}
                <FlatList
                    keyExtractor={(item) => item}
                    data={pastGuesses}
                    renderItem={renderListItem.bind(this, pastGuesses.length)}
                    contentContainerStyle={styles.list}
                />

            </View>

        </View>


    );


};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        padding: 1
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Dimensions.get('window').height > 600 ? 20 : 10,
        width: 400,
        maxWidth: "80%"

    },
    listContainer: {
        flex: 1,
        width: '60%'
    },
    listContainerBig: {
        flex: 1,
        width: '80%'
    },
    list: {
        flexGrow: 1,
        //alignItems: 'center',
        justifyContent: 'flex-end'
    },
    listItem: {
        borderColor: Colors.primary,
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'


    },
    control: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%'
    }

});
export default GameScreen;