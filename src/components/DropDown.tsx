import React from 'react';
import DropDownPicker, { ModeInterface } from 'react-native-dropdown-picker';
import { StyleSheet, View } from 'react-native';

interface Props {
    title: string,
    open: boolean,
    value: string | null,
    items: Array<object>,
    setOpen: React.SetStateAction<any>,
    setValue: React.SetStateAction<any>,
    setItems: React.SetStateAction<any>
}

const DropDown = ({ 
    title,
    open,
    value,
    items,
    setOpen,
    setValue,
    setItems, 
}: Props) => {
  return (
    <>
        <DropDownPicker
            dropDownDirection="TOP"
            placeholder={ title }
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={ styles.dropDown }
        />
    </>
  )
}

const styles = StyleSheet.create({
    
    dropDown: {
        backgroundColor:  "#F5F3F3",
        marginTop: 22,
        borderRadius: 5,
        borderColor: "rgb(165,162, 169)"
    }
})

export default DropDown