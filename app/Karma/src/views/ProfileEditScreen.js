import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import {RegularText} from "../components/text";
import {GradientButton} from "../components/buttons";
import PhotoUpload from "react-native-photo-upload";
import Styles from "../styles/Styles";
import EditableText from "../components/EditableText";
import BottomModal from "../components/BottomModal";
import CauseStyles from "../styles/CauseStyles";
import CauseItem from "../components/causes/CauseItem";
import Colours from "../styles/Colours";
import CauseContainer from "../components/causes/CauseContainer";
import {TextInput} from "../components/input";
import {RadioInput} from "../components/radio";

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;
const HALF = formWidth / 2;

const icons = {
    share: require("../assets/images/general-logos/share-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    calendar: require("../assets/images/general-logos/calendar-dark.png"),
    photo_add: require("../assets/images/general-logos/photo-plus-background.png"),
    new_cause: require("../assets/images/general-logos/new_cause.png"),
    ribbon: require("../assets/images/general-logos/ribbon.png"),
    orange_circle: require("../assets/images/general-logos/orange-circle.png"),
};

class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        const profile = this.props.navigation.getParam("profile");
        this.state = {
            name: profile.name,
            username: profile.username,
            location: "Location",
            bio: profile.bio,
            causes: profile.causes,
            points: profile.points,
            displaySignupModal: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.onChangeText = this.onChangeText.bind(this);

    }

    static navigationOptions = {
        headerShown: false,
    };

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    handleError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
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
                            width: SCREEN_WIDTH,
                            flexDirection: "row",
                        }}
                    />
                    <SafeAreaView style={Styles.safeAreaContainer}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colours.blue,
                                width: SCREEN_WIDTH,
                                justifyContent: "flex-start",
                                flexDirection: "row-reverse",
                            }}>
                            <TouchableOpacity>
                                <Image
                                    source={icons.edit_white}
                                    style={{
                                        height: 25,
                                        width: 25,
                                        marginHorizontal: formWidth * 0.05,
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
                                width: SCREEN_WIDTH,
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
                            <View>
                                <View style={{width: HALF}}>
                                    <EditableText
                                        text={this.state.name}
                                        style={[
                                            styles.nameText,
                                            {position: "absolute", top: -35},
                                        ]}
                                        onChange={val =>
                                            this.setState({name: val})
                                        }
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}>
                                    <EditableText
                                        text={this.state.username}
                                        style={styles.usernameText}
                                        onChange={val =>
                                            this.setState({username: val})
                                        }
                                    />
                                    <EditableText
                                        text={this.state.location}
                                        style={styles.locationText}
                                        onChange={val =>
                                            this.setState({location: val})
                                        }
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingTop: 20,
                                        justifyContent: "space-between",
                                    }}>
                                    <View style={[styles.pointContainer]}>
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
                                                left: 53,
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
                                backgroundColor: Colours.white,
                                paddingVertical: 25,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: formWidth * 0.075,
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                }}>
                                <RegularText style={styles.bioHeader}>
                                        First Name
                                    </RegularText>
                                <TextInput
                                placeholder={this.state.fname}
                                name="fname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.lname.focus()}
                            />
                                <RegularText style={styles.bioHeader}>
                                        Last Name
                                    </RegularText>
                            <TextInput
                                inputRef={ref => (this.lname = ref)}
                                placeholder={this.state.lname}
                                name="lname"
                                onChange={this.onChangeText}
                            />
                                <RegularText style={styles.bioHeader}>
                                        Username
                                    </RegularText>
                                <TextInput
                                    inputRef={ref => (this.username = ref)}
                                    placeholder={this.state.username}
                                    autoCapitalize="none"
                                    onChange={this.onChangeText}
                                    name="username"
                                />
                                <RegularText style={styles.bioHeader}>
                                        Gender
                                    </RegularText>
                            <RadioInput
                                values={[
                                    {value: "male", title: "Male"},
                                    {value: "female", title: "Female"},
                                    {value: "non-binary", title: "Non-Binary"},
                                ]}
                                value={this.state.gender}
                                onValue={value => this.setGender(value)}
                            />
                                <RegularText style={styles.bioHeader}>
                                    Bio
                                </RegularText>
                                <View style={{flexWrap: "wrap"}}>
                                    <EditableText
                                        text={this.state.bio}
                                        style={styles.contentText}
                                        onChange={val =>
                                            this.setState({bio: val})
                                        }
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-end",
                                    }}>
                                    <RegularText style={styles.bioHeader}>
                                        Causes
                                    </RegularText>
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
                                        <TouchableOpacity
                                        onPress={this.toggleModal}>
                                        <Image
                                            source={icons.new_cause}
                                            style={{
                                                height: SCREEN_WIDTH / 3.6,
                                                width: SCREEN_WIDTH / 3.6,
                                                borderRadius: 10,
                                                marginVertical: 4,
                                                paddingVertical: 16,
                                                paddingHorizontal: 6,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: Colours.white,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 0.08 * SCREEN_HEIGHT,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: 30,
                                backgroundColor: Colours.white,
                            }}>
                            <View style={{width: formWidth}}>
                                <GradientButton
                                    onPress={() => navigate("Profile")}
                                    title="Update"
                                />
                            </View>
                        </View>
                        <BottomModal
                            visible={this.state.displaySignupModal}
                            toggleModal={this.toggleModal}>
                            <CauseContainer
                                onSubmit={this.toggleModal}
                                onError={this.handleError}
                            />
                        </BottomModal>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    slider: {
        width: formWidth + formWidth * 0.1,
        height: 15,
    },
    switch: {
        alignSelf: "flex-start",
        marginTop: 5,
        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },
    nameText: {
        fontSize: 30,
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
        marginLeft: 80,
    },
    contentText: {
        fontSize: 18,
        color: Colours.grey,
        paddingVertical: 20,
    },
    editContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        borderColor: "transparent",
        borderBottomColor: Colours.lightGrey,
        borderWidth: 1.5,
    },
    pointContainer: {
        flex: 1,
    },
    leftItem: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
});

export default ProfileEditScreen;
