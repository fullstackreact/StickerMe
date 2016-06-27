import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const Close = ({style, size, color, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[style, styles.close, {fontSize: size, color: color}]}>×</Text>
  </TouchableOpacity>
);

var styles = StyleSheet.create({
  close: {
    fontWeight: 'bold',
    margin: 0,
    padding: 10,
    backgroundColor: 'transparent'
  }
})

Close.defaultProps = {
  size: 25,
  color: '#222',
  onPress: () => {}
}
Close.propTypes = {
  size: React.PropTypes.number,
  color: React.PropTypes.string,
  onPress: React.PropTypes.func,
}
export default Close;
