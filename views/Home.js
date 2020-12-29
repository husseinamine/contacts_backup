import React from 'react'
import { View, StyleSheet, PermissionsAndroid } from "react-native"
import Logo from "../components/Logo"
import Button from "../components/Button"
import auth from "@react-native-firebase/auth"
import Message from 'react-native-animated-message'
import Spinner from 'react-native-loading-spinner-overlay'
import Contacts from 'react-native-contacts'
import firestore from '@react-native-firebase/firestore'

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#23272a"
    }
})

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spinner: false,
            spinnerText: "Signing Out",
            messageColor: "green"
        }

        this.getContacts = this.getContacts.bind(this)
        this.uploadContacts = this.uploadContacts.bind(this)
        this.onSignOut = this.onSignOut.bind(this)
    }

    getContacts() {
        let message
        let messageColor
        let permission

        Contacts.requestPermission()
            .then((permissionGiven) => {
                permission = permissionGiven

                this.setState(prevState => {
                    return {
                        ...prevState,
                        spinner: true,
                        spinnerText: "Getting Contacts"
                    }
                })
            })
            .then(() => {
                switch (permission) {
                    case "authorized":
                        firestore()
                            .collection("contacts")
                            .doc(auth().currentUser.uid)
                            .get()
                            .then(userContacts => {
                                if (userContacts.exists) {
                                    const contacts = userContacts.data().contacts
                                    let contactsCounter = 0

                                    for (const contact of contacts) {
                                        contactsCounter++

                                        this.message.showMessage(`Adding Contacts (${contactsCounter}/${contacts.length})`, 3000)
                                        console.log(`Adding Contacts (${contactsCounter}/${contacts.length})`)
                                        Contacts.addContact(contact)
                                    }
                                    message = "Added All Contacts"
                                    messageColor = "green"

                                    this.message.showMessage(message, 10000)

                                } else {
                                    message = "No Backup Was Found In The Database"
                                    messageColor = "red"

                                    this.message.showMessage(message, 10000)
                                }
                            })
                        break
                    
                    case "denied":
                        message = "Permission Denied"
                        messageColor = "red"

                        this.message.showMessage(message, 10000)
                        break

                    default:
                        message = `Unkown Error: \`${permission}\``
                        messageColor = "red"

                        this.message.showMessage(message, 10000)
                        break
                }
            })
            .then(() => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        spinner: false,
                        messageColor
                    }
                })
            })
    }

    uploadContacts() {
        let message
        let messageColor

        this.setState(prevState => {
            return {
                ...prevState,
                spinner: true,
                spinnerText: "Uploading Contacts"
            }
        })

        Contacts.requestPermission()
            .then(async permission => {
                switch (permission) {
                    case "authorized":
                        const contacts = await Contacts.getAll()

                        try {
                            firestore()
                                .collection("contacts")
                                .doc(auth().currentUser.uid)
                                .get()
                                .then(userContacts => {
                                    if (userContacts.exists) {
                                        userContacts.ref.update({
                                            contacts: contacts
                                        })
                                    } else {
                                        userContacts.ref.set({
                                            contacts: contacts
                                        })
                                    }

                                    message = "Uploaded Contacts"
                                    messageColor = "green"

                                    this.message.showMessage("Uploaded Contacts", 10000)
                                })
                        } catch (e) {
                            message = `Unkown Error ${e.code}`
                            messageColor = "red"

                            this.message.showMessage(`Unkown Error ${e.code}`, 10000)
                        }
                        break
                    
                    case "denied":
                        message = "Permission Denied"
                        messageColor = "red"

                        this.message.showMessage(message, 10000)
                        break

                    default:
                        message = `Unkown Error: \`${permission}\``
                        messageColor = "red"

                        this.message.showMessage(message, 10000)
                        break
                }
            })

        this.setState(prevState => {
            return {
                ...prevState,
                spinner: false,
                messageColor
            }
        })

        this.message.showMessage(message, 5000)
    }

    onSignOut() {
        this.setState(prevState => {
            return {
                ...prevState,
                spinner: true
            }
        })
        auth().signOut()
            .then(() => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        spinner: false,
                        messageColor: "green"
                    }
                })
                this.message.showMessage("Signed Out Successfully!", 10000)
                this.props.navigation.navigate("Login")
            })
            .catch(e => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        messageColor: "red"
    
                    }
                })
                this.message.showMessage("Unknown Error: `" + e.code + "`", 10000)
            })
    }

    render() {
        return (
            <View style={styles.view} >
                    <Logo />
                    <Button onPress={this.getContacts}>Get Contacts</Button>
                    <Button onPress={this.uploadContacts}>Upload Contacts</Button>
                    <Button onPress={this.onSignOut}>Sign Out</Button>
                    <Message
                        ref={message => this.message = message}
                        animation={'slideY'}
                        position={'top'}
                        messageStyle={{
                            backgroundColor: this.state.messageColor
                        }}
                    >
                    </Message>
            </View>
        )
    }
}

export default Home