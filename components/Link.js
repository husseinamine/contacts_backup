import React from 'react'
import { TouchableOpacity, Text, View, Dimensions } from 'react-native'

const Link = (props) => {
    return (
        <View>
            <TouchableOpacity onPress={props.onPress} >
                <Text style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginTop: 5,
                    fontSize: props.size || 13,
                    width: Dimensions.get("window").width + 5,
                    color: "#7289da"
                }} >{props.children}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Link