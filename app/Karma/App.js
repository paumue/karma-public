import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import WelcomeScreen from "./src/views/WelcomeScreen";
import InitSignUpScreen from "./src/routes/InitSignupScreen";
import UserSignUpScreen from "./src/views/UserSignUpScreen";
import OrgSignUpScreen from "./src/views/OrgSignUpScreen";
import AboutScreen from "./src/views/AboutScreen";
import ContactInfoScreen from "./src/views/ContactInfoScreen";
import PrivacyScreen from "./src/views/PrivacyScreen";
import TermsScreen from "./src/views/TermsScreen";

const MainNavigator = createStackNavigator(
    {
        Welcome: {screen: WelcomeScreen},
        InitSignup: {screen: InitSignUpScreen},
        UserSignUp: {screen: UserSignUpScreen},
        OrgSignUp: {screen: OrgSignUpScreen},
        About: {screen: AboutScreen},
        Privacy: {screen: PrivacyScreen},
        Terms: {screen: TermsScreen},
        ContactInfo: {screen: ContactInfoScreen},
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: "#f8f8f8",
            },
        },
    },
);

const App = createAppContainer(MainNavigator);

export default App;
