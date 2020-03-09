import React, {Component} from "react";
import {TextInput, View, StyleSheet} from "react-native";
import {RegularText} from "./text";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";

class EditableText extends Component {
    constructor(props) {
        super(props);
    }

    getInnerRef = () => this.ref;
    render() {
        const {text, onChange, style} = this.props;
        return (
            <View>
                <TextInput
                    value={text}
                    onChangeText={onChange}
                    style={style}
                    autoCompleteType="off"
                    autoCorrect="false"
                    multiline={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({});

export default EditableText;
