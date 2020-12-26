import React from 'react'
import Login from "./views/Login"
import Register from "./views/Register"
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from "@react-navigation/native"

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode={false}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App