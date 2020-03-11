import {StyleSheet, Dimensions} from "react-native";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
const SignUpStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontWeight: "bold",
        color: "black",
        paddingLeft: 10,
    },
    subheaderText: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: "Arial",
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 25,
        color: "#3bbfb2",
    },

    textInput: {
        width: FORM_WIDTH,
        height: 45,
        borderColor: "transparent",
        borderBottomColor: "#D3D3D3",
        borderWidth: 1.5,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        color: "#7F7F7F",
        fontFamily: "OpenSans-Regular",
    },
    checkBox: {
        paddingRight: 20,
    },

    text: {
        color: "#7F7F7F",
    },

    linkColour: {
        color: "#3bbfb2",
    },
    errorMessage: {
        borderBottomColor: "#e81f10",
        marginBottom: 10,
    },
    errorText: {
        color: "#e81f10",
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D3D3D3",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    uploadButtonText: {
        fontSize: 15,
        fontWeight: "400",
        color: "gray",
    },
});

export default SignUpStyles;
