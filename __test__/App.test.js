import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import renderer from 'react-test-renderer';

import App from '../App';

describe('<App />', () => {
    it('has 1 child', () => {
        console.log(<App />)
    });
});
