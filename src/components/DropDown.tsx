import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet } from 'react-native';

interface Props {
    title: string,
    items: Array<object>,
    value: string[],
    open: boolean,
    setValue: React.SetStateAction<any>,
    setOpen: React.SetStateAction<any>,
    setItems: React.SetStateAction<any>,
    multiple?: boolean | undefined
}

const DropDown = ({ 
    title,
    items,
    value,
    open,
    setValue,
    setOpen,
    setItems,
    multiple=false
}: Props) => {

  return (
    <>
        <DropDownPicker
            autoScroll={true}
            maxHeight={300}
            dropDownDirection="TOP"
            placeholder={ title }
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={ styles.dropDown }
            listMode="SCROLLVIEW"
            multiple={ multiple }
        />
    </>
  )
}

const styles = StyleSheet.create({
    
    dropDown: {
        backgroundColor: "white",
        borderRadius: 5,
        borderColor: "rgb(165,162, 169)",
        borderTopLeftRadius: 18,
        borderTopEndRadius: 4,
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopWidth: 27,
        borderTopColor: 'white',
        borderBottomColor: 'white',
        marginBottom: 22
    }
});

export default DropDown;