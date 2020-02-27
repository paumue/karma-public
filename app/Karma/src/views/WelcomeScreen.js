import React, {Component} from "react";
import {View, StatusBar, Platform} from "react-native";
import {RegularText, LogoText} from "../components/text";
import {TransparentButton, TextButton} from "../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Styles from "../styles/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Colours from "../styles/Colours";

class WelcomeScreen extends Component {
    static navigationOptions = {headerShown: false};
    render() {
        const {navigate} = this.props.navigation;
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        return (
            <LinearGradient
                useAngle={true}
                angle={45}
                angleCenter={{x: 0.5, y: 0.5}}
                colors={[Colours.blue, Colours.lightBlue]}
                style={Styles.alignJustifyCenterContainer}>
                <SafeAreaView style={Styles.stretchContainer}>
                    <View style={[Styles.vcenter, Styles.textCenter]}>
                        <LogoText
                            style={[
                                Styles.white,
                                Styles.textCenter,
                                Styles.welcomeLogo,
                            ]}>
                            KARMA
                        </LogoText>
                        <RegularText
                            style={[
                                Styles.white,
                                Styles.textCenter,
                                Styles.xxxlarge,
                            ]}>
                            lorem ipsum
                        </RegularText>
                    </View>

                    <View style={Styles.bottom}>
                        <View style={[Styles.ph24, Styles.pb24, Styles.pt8]}>
                            <TransparentButton
                                onPress={() => navigate("InitSignup")}
                                white
                                title="Sign Up"
                            />

                            <TextButton
                                title="Already have an account? Login"
                                styles={[
                                    Styles.white,
                                    Styles.medium,
                                    Styles.pt16,
                                ]}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}

export default WelcomeScreen;
