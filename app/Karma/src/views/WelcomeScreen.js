import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RegularText } from "../components/text";


class WelcomeScreen extends Component {
    static navigationOptions = { headerShown: false }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>

                <View style={{ flex: 2, justifyContent: 'center' }}>
                    <RegularText style={[styles.text, { fontSize: 70 }]}>KARMA</RegularText>
                    <RegularText style={[styles.text, { fontSize: 40 }]}>lorem ipsum</RegularText>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 }}>
<<<<<<< HEAD
                    <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={this._onPressButton}>
                        <RegularText style={[styles.text, { fontSize: 20 }]}>Sign Up</RegularText>
=======
                    <TouchableOpacity style={[styles.button, { marginBottom: 20 }]} onPress={() => navigate("InitSignup")}>
                        <Text style={[styles.text, { fontSize: 20 }]}>Sign Up</Text>
>>>>>>> Update routing between new welcome page and initial signup
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._onPressButton}>
                        <RegularText style={[styles.text, { fontSize: 15, fontWeight: '200' }]}>Already have an account? Login</RegularText>
                    </TouchableOpacity>
                </View>

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#03A8AE'
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 125,
        paddingVertical: 10
    }

})

export default WelcomeScreen;
