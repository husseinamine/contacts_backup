import React, { useEffect, useState } from 'react'
import Login from "./views/Login"
import Register from "./views/Register"
import Home from "./views/Home"
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from "@react-navigation/native"
import { LogBox, TouchableOpacity, Image } from "react-native"

const Stack = createStackNavigator();

const App = () => {
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
    }, [])

    const [settingsTint, setSettingsTint] = useState("#7289da")

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={{
                        headerShown: false
                    }} 
                />
                <Stack.Screen 
                    name="Register" 
                    component={Register} 
                    options={{
                        headerShown: false
                    }} 
                />
                <Stack.Screen 
                    name="Home" 
                    component={Home} 
                    options={{
                        headerLeft: null,
                        headerStyle: {
                            backgroundColor: "#23272a",
                        },
                        headerTitleStyle: {
                            color: "#7289da",
                            fontWeight: "bold"
                        },
                        headerTitleAlign: "center"
                    }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App