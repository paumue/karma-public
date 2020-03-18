import React, {Component} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {RegularText} from "../components/text";
import {GradientButton, TransparentButton} from "../components/buttons";
import CauseItem from "../components/causes/CauseItem";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../styles/Styles";
import CarouselStyles, {
    itemWidth2,
    sliderWidth,
} from "../styles/CarouselStyles";
import Carousel from "react-native-snap-carousel";
import ActivityCard from "../components/activities/ActivityCard";
import Colours from "../styles/Colours";
import * as Keychain from "react-native-keychain";
import CauseStyles from "../styles/CauseStyles";
const {width} = Dimensions.get("window");
const formWidth = 0.8 * width;
const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    cog: require("../assets/images/general-logos/cog.png"),
    badge: require("../assets/images/general-logos/badges-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    edit_grey: require("../assets/images/general-logos/edit-grey.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    ribbon: require("../assets/images/general-logos/ribbon.png"),
    orange_circle: require("../assets/images/general-logos/orange-circle.png"),
};

const request = require("superagent");

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            name: "Name",
            username: "Username",
            location: "Location",
            bio: "this is your bio lorem ipsum and such",
            causes: [],
            points: 1,
            createdEvents: [],
            createdPastEvents: [],
            upcomingEvents: [],
            pastEvents: [],
            eventsToggle: true,
        };
        this.fetchProfileInfo();
    }

    static navigationOptions = {
        headerShown: false,
    };

    getData = async () => {
        try {
            // Retreive the credentials
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    "Credentials successfully loaded for user " +
                        credentials.username,
                );
                return credentials;
            } else {
                console.log("No credentials stored");
            }
        } catch (error) {
            console.log("Keychain couldn't be accessed!", error);
        }
    };

    async fetchProfileInfo() {
        const credentials = await this.getData();
        //const authToken = credentials.password;
        const userId = credentials.username;
        request
            .get("http://localhost:8000/profile")
            .query({userId: userId})
            .then(res => {
                const {
                    causes,
                    createdEvents,
                    createdPastEvents,
                    individual,
                    pastEvents,
                    upcomingEvents,
                    user,
                } = res.body.data;

                this.setState({
                    name: individual.firstName + " " + individual.lastName,
                    username: user.username,
                    location:
                        individual.address.townCity +
                        " " +
                        individual.address.postCode,
                    bio: individual.bio,
                    causes: causes,
                    points: individual.karmaPoints,
                    upcomingEvents: upcomingEvents,
                    pastEvents: pastEvents,
                    createdEvents: createdEvents,
                    createdPastEvents: createdPastEvents,
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer2}>
                <View style={[CarouselStyles.item2, CarouselStyles.shadow]}>
                    <ActivityCard
                        activity={item}
                        signedup={false}
                        key={item.id}
                    />
                </View>
            </View>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                enabled>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colours.blue,
                            height: 45,
                            width: width,
                            flexDirection: "row",
                        }}
                    />
                    <SafeAreaView style={Styles.safeAreaContainer}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                width: width,
                                justifyContent: "flex-start",
                                flexDirection: "row-reverse",
                            }}>
                            <TouchableOpacity
                                onPress={() => navigate("ProfileEdit")}>
                                <Image
                                    source={icons.edit_white}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.05,
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigate("SettingsMenu")}>
                                <Image
                                    onPress={() => navigate("SettingsMenu")}
                                    source={icons.cog}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.02,
                                        marginTop: 2,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                height: 160,
                                width: width,
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingRight: 30,
                                paddingBottom: 40,
                                flexDirection: "row",
                            }}>
                            <PhotoUpload
                                onPhotoSelect={avatar => {
                                    if (avatar) {
                                        console.log(
                                            "Image base64 string: ",
                                            avatar,
                                        );
                                        this.setPhoto(avatar);
                                    }
                                }}>
                                <Image
                                    style={{
                                        paddingVertical: 5,
                                        width: 140,
                                        height: 140,
                                        borderRadius: 75,
                                    }}
                                    resizeMode="cover"
                                    source={icons.photo_add}
                                />
                            </PhotoUpload>
                            <View
                                style={{
                                    paddingLeft: 38,
                                }}>
                                <RegularText style={styles.nameText}>
                                    {this.state.name}
                                </RegularText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <Text style={styles.usernameText}>
                                        {this.state.username}
                                    </Text>
                                    <Text style={styles.locationText}>
                                        {this.state.location}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 20,
                                        justifyContent: "space-between",
                                    }}>
                                    <View style={styles.pointContainer}>
                                        <Image
                                            source={icons.badge}
                                            style={{height: 60, width: 60}}
                                        />
                                        <Image
                                            source={icons.ribbon}
                                            style={{
                                                height: 60,
                                                width: 60,
                                                position: "absolute",
                                            }}
                                        />
                                        <Image
                                            source={icons.orange_circle}
                                            style={{
                                                height: 25,
                                                width: 25,
                                                left: 45,
                                                top: -8,
                                                position: "absolute",
                                            }}
                                        />
                                        <RegularText
                                            source={icons.orange_circle}
                                            style={{
                                                color: Colours.white,
                                                height: 25,
                                                width: 25,
                                                left: 50,
                                                top: -5,
                                                position: "absolute",
                                            }}>
                                            {this.state.points}
                                        </RegularText>
                                    </View>
                                    <TouchableOpacity>
                                        <Image
                                            source={icons.share}
                                            style={{
                                                height: 25,
                                                width: 25,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 5,
                                backgroundColor: "white",
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <GradientButton
                                    onPress={() => navigate("CreateActivity")}
                                    title="Create Activity"
                                    width={350}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingTop: 15,
                                }}>
                                <TransparentButton
                                    title="View Your Activities"
                                    size={15}
                                    ph={40}
                                    onPress={() =>
                                        navigate("CreatedActivities", {
                                            activities: this.state
                                                .createdEvents,
                                            pastActivities: this.state
                                                .createdPastEvents,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: formWidth * 0.075,
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Bio
                                    </RegularText>
                                    <View style={styles.editContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit")
                                            }>
                                            <Image
                                                source={icons.edit_grey}
                                                style={styles.edit}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}>
                                    <RegularText style={styles.contentText}>
                                        {this.state.bio}
                                    </RegularText>
                                </View>
                                <RegularText style={styles.bioHeader}>
                                    Causes
                                </RegularText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                    }}>
                                    {this.state.causes.length > 0 ? (
                                        <View style={CauseStyles.container}>
                                            {this.state.causes.map(cause => {
                                                return (
                                                    <CauseItem
                                                        cause={cause}
                                                        key={cause.id}
                                                        isDisabled={true}
                                                    />
                                                );
                                            })}
                                        </View>
                                    ) : (
                                        <View style={Styles.ph24}>
                                            <RegularText>
                                                You did not select any causes
                                            </RegularText>
                                        </View>
                                    )}

                                    <View style={styles.editContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate("ProfileEdit")
                                            }>
                                            <Image
                                                source={icons.edit_grey}
                                                style={styles.edit}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                            }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: formWidth * 0.075,
                                }}>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            eventsToggle: !this.state
                                                .eventsToggle,
                                        })
                                    }>
                                    <RegularText
                                        style={
                                            this.state.eventsToggle
                                                ? styles.bioHeader
                                                : styles.bioHeaderAlt
                                        }>
                                        {this.state.upcomingEvents.length > 0
                                            ? "Upcoming Events"
                                            : "No Upcoming Events"}
                                    </RegularText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            eventsToggle: !this.state
                                                .eventsToggle,
                                        })
                                    }
                                    style={{
                                        alignSelf: "flex-start",
                                        marginLeft: 80,
                                    }}>
                                    <RegularText
                                        style={
                                            this.state.eventsToggle
                                                ? styles.bioHeaderAlt
                                                : styles.bioHeader
                                        }>
                                        Past Events
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                }}>
                                <Carousel
                                    ref={c => {
                                        this._carousel = c;
                                    }}
                                    data={
                                        this.state.eventsToggle
                                            ? this.state.upcomingEvents
                                            : this.state.pastEvents
                                    }
                                    removeClippedSubviews={false}
                                    renderItem={this._renderItem}
                                    sliderWidth={sliderWidth}
                                    itemWidth={itemWidth2}
                                    inactiveSlideOpacity={1}
                                    inactiveSlideScale={1}
                                    containerCustomStyle={CarouselStyles.slider}
                                    onSnapToItem={index =>
                                        this.setState({activeSlide: index})
                                    }
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    nameText: {
        fontSize: 25,
        color: Colours.white,
        fontWeight: "bold",
    },
    usernameText: {
        fontSize: 20,
        color: Colours.white,
    },
    locationText: {
        fontSize: 20,
        color: "#75C4C3",
        paddingLeft: 10,
    },
    bioHeader: {
        paddingTop: 25,
        fontSize: 20,
        color: Colours.black,
        fontWeight: "500",
    },
    bioHeaderAlt: {
        paddingTop: 25,
        fontSize: 18,
        color: Colours.blue,
        fontWeight: "500",
    },
    contentText: {
        fontSize: 15,
        color: Colours.black,
        paddingVertical: 5,
    },
    answerText: {
        fontSize: 15,
        color: Colours.blue,
        paddingVertical: 5,
        paddingLeft: 5,
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    edit: {
        height: 25,
        width: 25,
        alignSelf: "center",
        resizeMode: "contain",
    },
    pointContainer: {
        flex: 1,
    },
});

export default ProfileScreen;
