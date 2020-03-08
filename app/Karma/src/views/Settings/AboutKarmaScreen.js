import React, {Component} from "react";
import {
    View,
    Image,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    Text,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {ScrollView} from "react-native-gesture-handler";
import {RegularText} from "../../components/text";
import SettingsButton from "../../components/buttons/SettingsButton";

const request = require("superagent");

const logo = require("../../assets/images/settings-logos/K-logo.png");

function loadAboutData(screen) {
    request
        .post("https://baconipsum.com/api/?type=meat-and-filler")
        .then(res => {
            console.log(res.body);
            screen.setState({
                aboutText: res.body,
            });
        })
        .catch(er => {
            console.log(er.message);
        });
}

class AboutKarmaScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            aboutText: "Loading...",
        };
        loadAboutData(this);
    }

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="About Karma" />
                </View>
                <View style={Styles.ph24}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 30,
                    }}>
                    <Image
                        source={logo}
                    />
                    </View>
                    <RegularText style={Styles.pb11}>
                        {this.state.aboutText}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}

export default AboutKarmaScreen;
