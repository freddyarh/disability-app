import React from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';

interface Props {
  navigation: () => void;
  color?: string;
  backgroundColor?: string;
}

const IconGoBack = ({ navigation, color='white', backgroundColor='black' }: Props) => {
  return (
    
    <Text style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
        <Avatar.Icon icon="arrow-left" color={ color } size={ 40 } style={{ backgroundColor: backgroundColor }} />
    </Text>
  )
};

export default IconGoBack;