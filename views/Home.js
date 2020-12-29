import React from 'react'
import { View, StyleSheet, PermissionsAndroid, Text, ActivityIndicator } from "react-native"
import Logo from "../components/Logo"
import Button from "../components/Button"
import auth from "@react-native-firebase/auth"
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
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS)
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        
    }

    getContacts() {

        this.setState(prevState => {
            return {
                ...prevState,
                message: `Adding Contacts`,
                spinner: true
            }
        })

        let message
        let messageColor

        Contacts.requestPermission()
            .then(async permission => {
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
                                        
                                        Contacts.getContactsMatchingString(contact.givenName)
                                            .then(givenContact => {
                                                if (JSON.stringify(contact) !== JSON.stringify(givenContact)) {
                                                    console.log(`Adding Contacts (${contactsCounter}/${contacts.length})`)
                                                    Contacts.addContact(contact)
                                                }
                                            })
                                        
                                        this.setState(prevState => {
                                            return {
                                                ...prevState,
                                                message: `Adding Contacts (${contactsCounter}/${contacts.length})`
                                            }
                                        })
                                    }
                                    message = "Added All Contacts"
                                    messageColor = "green"

                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            spinner: false,
                                            messageColor,
                                            message
                                        }
                                    })

                                } else {
                                    message = "No Backup Was Found In The Database"
                                    messageColor = "red"

                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            spinner: false,
                                            messageColor,
                                            message
                                        }
                                    })
                                }
                            })
                        break
                    
                    case "denied":
                        message = "Permission Denied"
                        messageColor = "red"

                        this.setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false,
                                messageColor,
                                message
                            }
                        })
                        break

                    default:
                        message = `Unkown Error: \`${permission}\``
                        messageColor = "red"

                        this.setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false,
                                messageColor,
                                message
                            }
                        })
                        break
                }
            })
            .then(() => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        spinner: false,
                        messageColor,
                        message
                    }
                })
            })
    }

    uploadContacts() {
        let message
        let messageColor

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

                                    this.setState(prevState => {
                                        return {
                                            ...prevState,
                                            spinner: false,
                                            messageColor,
                                            message
                                        }
                                    })
                                })
                        } catch (e) {
                            message = `Unkown Error ${e.code}`
                            messageColor = "red"

                            this.setState(prevState => {
                                return {
                                    ...prevState,
                                    spinner: false,
                                    messageColor,
                                    message
                                }
                            })
                        }
                        break
                    
                    case "denied":
                        message = "Permission Denied"
                        messageColor = "red"

                        this.setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false,
                                messageColor,
                                message
                            }
                        })
                        break

                    default:
                        message = `Unkown Error: \`${permission}\``
                        messageColor = "red"
                        this.setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false,
                                messageColor,
                                message
                            }
                        })
                        break
                }
            })

        this.setState(prevState => {
            return {
                ...prevState,
                spinner: false,
                messageColor,
                message
            }
        })

        this.setState(prevState => {
            return {
                ...prevState,
                spinner: false,
                messageColor,
                message
            }
        })
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
                this.props.navigation.navigate("Login")
            })
            .catch(e => {
                this.setState(prevState => {
                    return {
                        ...prevState,
                        messageColor: "red",
                        message: message
    
                    }
                })
            })
    }

    render() {
        return (
            <View style={styles.view} >
                    <Text style={{
                        backgroundColor: "#2C2F33",
                        color: "#7289da",
                        borderRadius: 5,
                        padding: 5
                    }}>{this.state.message || "Welcome!"}</Text>
                    <Logo />
                    <Button onPress={this.getContacts}>Get Contacts</Button>
                    <Button onPress={this.uploadContacts}>Upload Contacts</Button>
                    <Button onPress={this.onSignOut}>Sign Out</Button>
            </View>
        )
    } 
}

export default Home