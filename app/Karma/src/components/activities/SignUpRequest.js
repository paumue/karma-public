import React from "react";

import {TouchableOpacity, View, Image} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
const icons = {
    check: require("../../assets/images/general-logos/green-check.png"),
    cancel: require("../../assets/images/general-logos/cancel.png"),
};

export default class SignUpRequest extends React.Component {
    render() {
        const {user} = this.props;
        return (
            <View style={[Styles.pv8, Styles.ph8]}>
                <View
                    style={[
                        Styles.pv8,
                        {
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            backgroundColor: Colours.white,
                            borderWidth: 3,
                            borderColor: Colours.grey,
                        },
                    ]}
                    activeOpacity={0.9}>
                    <TouchableOpacity style={{width: 150}}>
                        <RegularText style={[Styles.ph8, {fontSize: 20}]}>
                            {user}
                        </RegularText>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                        }}>
                        <TouchableOpacity
                            style={{
                                width: 30,
                                paddingRight: 15,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            }}>
                            <Image
                                source={icons.check}
                                // onPress={() => APPROVE}
                                style={{
                                    height: 30,
                                    alignSelf: "center",
                                    justifyContent: "flex-end",
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <View style={{width: 50}} />
                        <TouchableOpacity
                            style={{
                                width: 30,
                                paddingRight: 27,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            }}>
                            <Image
                                source={icons.cancel}
                                // onPress={() => DISAPPROVE}
                                style={{
                                    height: 30,
                                    alignSelf: "center",
                                    justifyContent: "flex-end",
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
