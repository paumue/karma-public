import React, {Component} from "react";
import {TextInput, View} from "react-native";

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
                    autoCorrect={false}
                    multiline={true}
                />
            </View>
        );
    }
}

export default EditableText;
