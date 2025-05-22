import React from 'react';
import { TextInput } from 'react-native-paper';

const CustomTextInputIcon = ({ icon = 'default-icon', color = 'black', ...props }) => {
    return (
      <TextInput.Icon icon={icon} color={color} {...props} />
    );
  };

export default CustomTextInputIcon;