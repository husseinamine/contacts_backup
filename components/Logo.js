import React from "react"
import { Image, Dimensions } from "react-native"

const Logo = () => {
    return (
        <Image 
            source={require("../logos/cover.png")}

            style={{
                width: Dimensions.get("window").width,
                height: 200
            }}
        />
    )
}

export default Logo