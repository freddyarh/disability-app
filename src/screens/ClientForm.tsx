import React, { useState } from 'react'
import { Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';

const ClientForm = () => {

    const [time, setTime] = useState("");
    const [functionality, setFunctionality] = useState("");
    const [prompt, setPrompt] = useState("");
    const [bechaviour, setBechaviour] = useState("");
    const [comment, setComment] = useState("");

    const [checked, setChecked] = useState(false);

    const handleCLientForm = () => {
        console.log('Client form');
    }

  return (
    <View style={ globalStyles.container }>
        <Text>Time</Text>
        <Input label="Time" value={ time } setValue={ setTime } />
        <Text>Function</Text>
        <Input label="Function" value={ functionality } setValue={ setFunctionality } />
        <Text>Prompt</Text>
        <Input label="Prompt" value={ prompt } setValue={ setPrompt } />
        <Text>Displayed Behaviour</Text>
        <Input label="Displayed Behaviour" value={ bechaviour } setValue={ setBechaviour } />
        <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
            }}  
        />
        <Text>Comments</Text>
        <Input label="Comments" value={ comment } setValue={ setComment } />
        <Button label="Create" buttonEvent={ handleCLientForm } disabled={false}/>
    </View>
  )
}

export default ClientForm;