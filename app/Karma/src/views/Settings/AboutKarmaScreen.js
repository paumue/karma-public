import React, {Component} from "react";
import {Image, SafeAreaView, View} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import { REACT_APP_API_URL } from 'react-native-dotenv';
const request = require("superagent");

const logo = require("../../assets/images/settings-logos/K-logo.png");

class AboutKarmaScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            aboutText: "Loading...",
        };
        this.loadAboutText();
    }

    loadAboutText = () => {
        request
            .get(`${REACT_APP_API_URL}/information?type=about`)
            .then(res => {
                console.log(res.body.message);
                this.setState({
                    aboutText: res.body.data.information.content,
                });
            })
            .catch(er => {
                console.log(er.message);
            });
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="About Karma" />
                </View>
                <View style={Styles.ph24}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            margin: 30,
                        }}>
                        <Image source={logo} />
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
