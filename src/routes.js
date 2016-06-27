import React from 'react'
import {
  View, Text
} from 'react-native'
import Close from './components/Close'

export const routes = {
  'welcome': {
    key: 'welcome', noHeader: true
  },
  'signup': {
    key: 'signup',
    title: 'Sign up',
    modal: true,
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0
    },
    leftComponent: null,
    rightComponent: (props) => {
      const onClose = () => {
        const {actions} = props.scene.route;
        const {navigation} = actions;
        navigation.pop();
      }
      return (<Close onPress={onClose}/>)
    }
  }
}

export default routes;
