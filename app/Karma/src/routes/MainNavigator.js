import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import WelcomeScreen from "../views/WelcomeScreen";
import InitSignUpScreen from "../views/InitSignupScreen";
import UserSignUpScreen from "../views/UserSignUpScreen";
import OrgSignUpScreen from "../views/OrgSignUpScreen";
import AboutScreen from "../views/AboutScreen";
import ContactInfoScreen from "../views/ContactInfoScreen";
import PickCausesScreen from "../views/PickCausesScreen";
import PrivacyScreen from "../views/Settings/PrivacyScreen";
import TermsScreen from "../views/Settings/TermsScreen";
import SettingsMenuScreen from "../views/Settings/SettingsMenuScreen";
import CreateActivityScreen from "../views/CreateActivityScreen";
import VerifyScreen from "../views/VerifyScreen";
import MainTabNavigator from "./MainTabNavigator";
import ProfileScreen from "../views/ProfileScreen";
import NotificationsScreen from "../views/NotificationsScreen";

const MainNavigator = createStackNavigator(
    {
        Welcome: {
            screen: WelcomeScreen,
        },
        InitSignup: {
            screen: InitSignUpScreen,
        },
        UserSignUp: {
            screen: UserSignUpScreen,
        },
        OrgSignUp: {
            screen: OrgSignUpScreen,
        },
        About: {
            screen: AboutScreen,
        },
        Tab: MainTabNavigator,
        Privacy: {
            screen: PrivacyScreen,
        },
        Terms: {
            screen: TermsScreen,
        },
        SettingsMenu: {
            screen: SettingsMenuScreen,
        },
        PickCauses: {
            screen: PickCausesScreen,
        },
        Verify: {
            screen: VerifyScreen,
        },
        Profile: {
            screen: ProfileScreen,
        },
        CreateActivity: {
            screen: CreateActivityScreen,
        },
        Notifications: {
            screen: NotificationsScreen,
        },
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
        },
    },
);

MainNavigator.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    return {
        tabBarVisible,
    };
};

export default MainNavigator;
