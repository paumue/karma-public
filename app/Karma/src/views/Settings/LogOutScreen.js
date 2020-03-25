import React, {Component} from "react";
import {View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {useNavigation} from "react-navigation-hooks";

class LogOutScreen extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await AsyncStorage.removeItem("ACCESS_TOKEN");
        this.props.navigation.navigate("Welcome");
    }

    render() {
        return <View />;
    }
}

export default props => {
    const navigation = useNavigation();
    return <LogOutScreen {...props} navigation={navigation} />;
};
