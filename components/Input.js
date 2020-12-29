import React from 'react'
import { TextInput, Dimensions } from 'react-native'

const Input = (props) => {
    return (
        <TextInput
                secureTextEntry={props.secure}
                onChangeText={props.onChange}
                selectionColor="#7289da"
                placeholderTextColor="#9c9c9c" 
                placeholder={props.placeholder}
                style={{
                    backgroundColor: "#2C2F33",
                    borderWidth: 1,
                    borderRadius: 5,
                    color: "#FFFFFF",
                    width: props.width || Dimensions.get("window").width - 10,
                    height: props.height,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderColor: "#2C2F33",
                    marginTop: 5
                }} />
    )
}

export default Input