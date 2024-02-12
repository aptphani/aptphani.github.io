/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */

import { Box, Grid, Icon } from '@chakra-ui/react';

import { MdBackspace } from 'react-icons/md';
import React, { useContext } from 'react';
import Styles from '../Dailpad.module.css';
import { AppContext } from '../../../../AppContext';

const dailPadButtons = [
    { value: 1, type: 'value' },
    { value: 2, type: 'value' },
    { value: 3, type: 'value' },
    { value: 4, type: 'value' },
    { value: 5, type: 'value' },
    { value: 6, type: 'value' },
    { value: 7, type: 'value' },
    { value: 8, type: 'value' },
    { value: 9, type: 'value' },
    { value: 'CLEAR', type: 'action', color: '#e0e3e5' },
    // { value: " ", type: "action", color: "#e0e3e5" },
    { value: 0, type: 'value' },
    {
      value: 'BACKSPACE',
      type: 'action',
      color: '#e0e3e5',
      icon: 'MdBackspace',
    },
  ];
  
  const dailPadActions = button => {
  
    switch(button.value) {
     case 'enter':
       clearField();
       break;
       
     case 'clear':
       onUpdateValue('');  
       break;
       
     // Other cases
    }
  };
  
  const dailPadButtonHandler = (e, button) => {
  
    switch(button.type) {
      case 'value':
        updateCurrentInput(button);   
        break;
      
      case 'action':
        dailPadActions(button);
        break;
    }  
  };
  
  const isTouchUncertain = (event) => {
  
    // Implement certainty checks
    return isUncertain; 
  };
  
  function compensateUncertainty() {
    
    // Apply temporary sensitivity boost   
  }
  
  const onTouchStart = (event) => {
  
    if(isTouchUncertain(event)) { 
      compensateUncertainty();
    }
  };
  
  return (
    <Box onTouchStart={onTouchStart}> 
      {/* Actual component jsx */}
    </Box>
  )