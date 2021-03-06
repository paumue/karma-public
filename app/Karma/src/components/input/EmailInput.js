import React from "react";
import TextInput from "./TextInput";
const validate = require("validate.js");

export default class EmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: "",
            isValid: false,
        };
    }

    /**
     * Check if email is of a valid format
     */

    isValidEmail() {
        const invalidEmail = validate(
            {from: this.state.emailInput},
            emailConstraints,
        );
        // invalidEmail == undefined if email is correct
        return !invalidEmail;
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
        this.props.onChange(name, text);
    };

    onSubmitEditing = () => {
        this.props.onSubmitEditing(this.isValidEmail());
    };

    render() {
        return (
            <TextInput
                autoCapitalize={"none"}
                name="emailInput"
                placeholder="Please enter your email"
                autoFocus={true}
                style={this.props.style}
                showError={this.props.showEmailError && !this.isValidEmail()}
                errorText={"Please enter a valid email."}
                onChange={this.onChangeText}
                onSubmitEditing={this.onSubmitEditing}
            />
        );
    }
}
// for email verification
export const emailConstraints = {
    from: {
        // Email is required
        presence: true,
        email: true,
    },
};
