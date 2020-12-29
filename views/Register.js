import React from 'react'
import Button from "../components/Button"
import Input from "../components/Input"
import Logo from "../components/Logo"
import Link from "../components/Link"
import { View, StyleSheet } from "react-native"
import auth from "@react-native-firebase/auth"
import Message from 'react-native-animated-message'
import Spinner from 'react-native-loading-spinner-overlay'

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#23272a"
    }
})

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: ""
        }

        this.onEmailChange = this.onEmailChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onSubmitForm = this.onSubmitForm.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        const user = auth().currentUser
        
        if (user) {
            console.log('user logged')
            this.props.navigation.navigate("Home")
        }
    }

    onEmailChange(text) {
        this.setState(prevState => {
            return {
                email: text,
                password: prevState.password
            }
        })
    }

    onPasswordChange(text) {
        this.setState(prevState => {
            return {
                email: prevState.email,
                password: text
            }
        })
    }

    onSubmitForm() {
        if (this.state.email.trim() == "" || this.state.password.trim() == "") {
            this.message.showMessage("Email And Password Required!", 3000)
        } 
        else {

            this.setState(prevState => {
                return {
                    ...prevState,
                    spinner: true
                }
            })

            auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password.trim())
                .then(() => {                    
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            spinner: false
                        }
                    })

                    this.props.navigation.navigate("Home")
                })
                .catch(e => {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            spinner: false
                        }
                    })
                    
                    switch (e.code) {
                        case "auth/invalid-email":
                            this.message.showMessage("Invalid Email", 3000)
                            break

                        case "auth/weak-password":
                            this.message.showMessage("Weak Password!", 3000)
                            break

                        default:
                            this.message.showMessage("Unknown Error: `" + e.code + "`", 3000)
                    }
                })
        }
    }

    render() {
        return (
            <View style={styles.view} >
                    <Logo />
                    <Input placeholder="email" onChange={this.onEmailChange} />
                    <Input placeholder="password" secure={true} onChange={this.onPasswordChange} />
                    <Link onPress={() => this.props.navigation.navigate("Login")}>Have an account?</Link>
                    <Button onPress={this.onSubmitForm}>register</Button>
                    <Message
                        ref={message => this.message = message}
                        animation={'slideY'}
                        position={'top'}
                        messageStyle={{
                            backgroundColor: "red"
                        }}
                    >
                    </Message>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Creating Account'}
                        textStyle={styles.spinnerTextStyle}
                    />
            </View>
        )
    }
}

export default Register