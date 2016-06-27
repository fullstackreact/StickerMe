import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

const Divider = ({color}) => (
  <View style={[styles.seperator, {borderColor: color}]}></View>
);

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    paddingVertical: 10,
    marginVertical: 10,
  }
});

Divider.defaultProps = {
  color: '#222'
}
Divider.propTypes = {
  color: React.PropTypes.string,
}

export default Divider;
