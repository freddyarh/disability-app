import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { colors } from '../styles/colors'

export const LoadingScreen = ({ color=colors.black, backgroundColor = colors.black }) => {
    return (
        <View style={{ 
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backgroundColor
        }}>
            <ActivityIndicator 
                size={ 50 }
                color={ color }
            />
        </View>
    )
}
