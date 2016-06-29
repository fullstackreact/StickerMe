import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import WelcomeScreen from '../../components/Welcome'
import Signup from '../../components/Signup'

export const PublicView = React.createClass({
  render() {
    const props = this.props;
console.log('PublicView thing ->', props);
    return props.route && props.route.routeKey === 'signup' ?
            <Signup {...props} /> :
            <WelcomeScreen {...props} />
  }
})
// (props) => {
export default PublicView;
