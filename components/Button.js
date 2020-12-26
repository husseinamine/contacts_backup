import React from 'react'
import { TouchableOpacity, Text, Dimensions } from 'react-native'

const Button = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} >
            <Text style={{
                backgroundColor: "#7289da",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontSize: props.size || 20,
                borderRadius: props.radius || 5,
                width: props.width || Dimensions.get("window").width - 10,
                height: props.height,
                textAlign: "center",
                marginTop: 5,
                color: "white"
            }} >{props.children}</Text>
        </TouchableOpacity>
    )
}

export default Button