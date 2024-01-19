import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { colors } from '../styles/colors'

export const LoadingScreen = ({ color=colors.black }) => {
    return (
        <View style={{ 
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white
        }}>
            <ActivityIndicator 
                size={ 50 }
                color={ color }
            />
        </View>
    )
}
