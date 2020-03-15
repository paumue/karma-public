import React, {Component} from "react";
import {View, Image, Text} from "react-native";
import {RegularText, BoldText, SemiBoldText} from "../components/text";
import Styles from "../styles/Styles";
import {TouchableOpacity} from "react-native-gesture-handler";
import Colours from "../styles/Colours";
const request = require("superagent");

/**
 * Notification types:
 * -- "Message" --
 * -- "ActivityUpdate" --
 * -- "EventCancellation" --
 * -- "AttendanceCancellation" --
 * -- "AttendanceConfirmation" --
 */
export default class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgName: "The P.E.E.R Center",
        };
    }

    async componentDidMount() {
        this.getOrgName();
    }

    /**
     * Opens email app on the user's phone
     */
    _sendReply = () => {
        //open email here
    };

    _renderReplyButton = () => {
        return (
            <TouchableOpacity onPress={() => this._sendReply()}>
                <SemiBoldText style={{color: Colours.blue}}>Reply</SemiBoldText>
            </TouchableOpacity>
        );
    };

    getOrgName = async (orgId) => {
        try {
           const body = {userId: 12};
           console.log(body);
            const response = await request.get("http://localhost:8000/profile").send("ass").then(res => {console.log(res.body); return res.json()})
            .catch(err => console.log(err));
        }
        catch(error){
            console.log(error);
        }

        //get org name from profile endpoint
    };

    render() {
        const {notification} = this.props;
        const isMessage = notification.type === "Message";
        const daysAgo =
            notification.daysAgo === 0 ? "Today" : notification.daysAgo + "d";
        const colon = isMessage ? " " : ": ";
        return (
            <>
                <View style={[Styles.pb16, {flexDirection: "row"}]}>
                    <Image
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            alignSelf: "center",
                        }}
                        source={{uri: "https://picsum.photos/200"}}
                    />
                    <View
                        style={[
                            Styles.ph16,
                            {alignSelf: "center", flexShrink: 1},
                        ]}>
                        <Text>
                            <BoldText>
                                {this.state.orgName}
                                {colon}
                            </BoldText>
                            <RegularText>{notification.message}</RegularText>
                            <RegularText style={{color: Colours.grey}}>
                                {" "}
                                {daysAgo}
                            </RegularText>
                        </Text>
                        {/**
                         * Render the reply button only if the notification type is a 'Message'
                         */}
                        {isMessage && this._renderReplyButton()}
                    </View>
                </View>
            </>
        );
    }
}
