import React from 'react'
import Button from "../components/Button"
import Input from "../components/Input"
import Logo from "../components/Logo"
import Link from "../components/Link"
import { View, StyleSheet } from "react-native"

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#23272a"
    }
})

const Login = () => {
    return (
        <View style={styles.view} >
                <Logo />
                <Input placeholder="name" />
                <Input placeholder="password" secure={true} />
                <Link>Dont have an account?</Link>
                <Button>login</Button>
        </View>
    )
}

export default Login