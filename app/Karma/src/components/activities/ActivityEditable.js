import React from "react";

import {Image, StyleSheet, TouchableOpacity, View, Alert} from "react-native";
import {RegularText} from "../text";
import CarouselStyles from "../../styles/CarouselStyles";
import Colours from "../../styles/Colours";
import {useNavigation} from "react-navigation-hooks";
import {sendNotification} from "../../util/SendNotification";
import {getMonthName, formatAMPM, getDate} from "../../util/DateTimeInfo";
import Styles from "../../styles/Styles";
import Communications from "react-native-communications";
import {REACT_APP_API_URL} from "react-native-dotenv";

import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import request from "superagent";
import {getAuthToken} from "../../util/credentials";

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
    dots: require("../../assets/images/general-logos/triple-dot-blue.png"),
    calendar: require("../../assets/images/general-logos/calendar-light.png"),
    location: require("../../assets/images/general-logos/location-logo.png"),
};

const ActivityEditable = props => {
    const navigation = useNavigation();
    const {activity, creatorName, email} = props;
    const volunteers = activity.volunteers;

    /**
     * Delete the event selected
     */
    const deleteEvent = async () => {
        const activityId = activity.id;
        const authToken = await getAuthToken();
        const url = `${REACT_APP_API_URL}/event/${activityId}/delete/`;
        await request
            .post(url)
            .set("authorization", authToken)
            .then(res => {
                navigation.navigate("Profile");
            });
        sendNotification("EventCancellation", `${activity.name}`, volunteers);
    };

    /**
     * Fetches each volunteer's profile.
     * This is used to then get the full name and email of each volunteer.
     */
    const fetchAttendeeInfo = async () => {
        const authToken = await getAuthToken();

        let attendees = [];
        for (let i = 0; i < volunteers.length; ++i) {
            const volunteerProfile = await request
                .get(`${REACT_APP_API_URL}/profile/`)
                .query({otherUserId: volunteers[i]})
                .set("authorization", authToken)
                .then(res => {
                    return res.body.data;
                });
            attendees.push(volunteerProfile);
        }

        return attendees;
    };

    const sendMessageToAttendees = async () => {
        let attendees = await fetchAttendeeInfo();
        let attendeeEmails = [];
        attendees.forEach(a => {
            attendeeEmails.push(a.user.email);
        });

        sendNotification("Message", "", volunteers);

        //Placing emails in the 'BCC' section so attendees can only see their own emails
        Communications.email(
            null,
            null,
            attendeeEmails,
            `Karma - ${activity.name}`,
            null,
        );
    };

    return (
        <View>
            <View
                style={{
                    backgroundColor: Colours.backgroundWhite,
                    height: 30,
                    alignItems: "flex-end",
                }}>
                <View>
                    <TouchableOpacity>
                        <Menu>
                            <MenuTrigger>
                                <Image
                                    source={icons.dots}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 20,
                                        marginBottom: 10,
                                    }}
                                    resizeMode="contain"
                                />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption
                                    onSelect={() => Alert.alert("Share")}>
                                    <RegularText style={styles.settingsText}>
                                        Share Activity
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() =>
                                        navigation.navigate("CreateActivity", {
                                            activity: activity,
                                            creatorName: creatorName,
                                            email: email,
                                        })
                                    }>
                                    <RegularText style={styles.settingsText}>
                                        Edit Activity
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() =>
                                        navigation.navigate("ViewSignUps", {
                                            activity: activity,
                                        })
                                    }>
                                    <RegularText style={styles.settingsText}>
                                        View Sign Ups
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => {
                                        sendMessageToAttendees();
                                    }}>
                                    <RegularText style={styles.settingsText}>
                                        Message Attendees
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() =>
                                        navigation.navigate("Attendance", {
                                            activity: activity,
                                        })
                                    }>
                                    <RegularText style={styles.settingsText}>
                                        Attendance
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => {
                                        Alert.alert(
                                            "Are you sure you want to delete this event?",
                                            "",
                                            [
                                                {
                                                    text: "Confirm",
                                                    onPress: () =>
                                                        deleteEvent(),
                                                },
                                                {
                                                    text: "Cancel",
                                                    onPress: () => {},
                                                },
                                            ],
                                        );
                                    }}>
                                    <RegularText style={styles.settingsText}>
                                        Delete Activity
                                    </RegularText>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={CarouselStyles.itemContainer3}>
                <View style={[CarouselStyles.item3]}>
                    <View style={[Styles.container, Styles.ph24]}>
                        <View style={[Styles.pb24, Styles.bottom]}>
                            <Image
                                source={{
                                    uri: `https://picsum.photos/seed/${
                                        props.activity.eventId
                                    }/800/200`,
                                }}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: null,
                                    marginBottom: 10,
                                }}
                                resizeMode="cover"
                            />
                            <Image
                                source={icons.date}
                                style={[styles.icon, {left: 5}]}
                            />
                            <RegularText
                                style={[styles.dateText, {top: 5, left: 1}]}>
                                {` ${new Date(activity.date).getDate()}`}
                            </RegularText>
                            <RegularText style={styles.dateText}>
                                {`  ${getMonthName(props.activity.date)}`}
                            </RegularText>
                            <View>
                                <RegularText
                                    style={{
                                        fontWeight: "500",
                                        fontSize: 20,
                                        marginVertical: 8,
                                    }}>
                                    {activity.name || "Full Name"}
                                </RegularText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                }}>
                                <Image
                                    source={icons.calendar}
                                    style={{
                                        alignSelf: "flex-start",
                                        justifyContent: "center",
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                    resizeMode="contain"
                                />
                                <View>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {getDate(activity.date) || "Full Date"}
                                    </RegularText>
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                            color: Colours.lightGrey,
                                            fontWeight: "500",
                                        }}>
                                        {`${formatAMPM(activity.date)}`}
                                    </RegularText>
                                </View>
                            </View>
                            <View style={[Styles.pv16, {flexDirection: "row"}]}>
                                <Image
                                    source={icons.location}
                                    style={{
                                        alignSelf: "flex-start",
                                        justifyContent: "center",
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                    resizeMode="contain"
                                />
                                <View>
                                    <RegularText
                                        style={{
                                            fontSize: 16,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {activity.address1 +
                                            ", " +
                                            activity.address2 +
                                            ","}
                                    </RegularText>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {activity.postcode +
                                            ", " +
                                            activity.city || "Full Location"}
                                    </RegularText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dateText: {
        position: "absolute",
        top: 25,
        left: 0,
        height: 50,
        width: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        color: "white",
    },
    settingsText: {
        fontSize: 15,
    },
    icon: {
        position: "absolute",
        top: 5,
        right: 5,
        height: 50,
        width: 50,
        resizeMode: "contain",
    },
});

export default ActivityEditable;
