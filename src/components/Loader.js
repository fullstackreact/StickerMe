import React, { Component } from 'react';
import { StyleSheet, ActivityIndicatorIOS, View } from 'react-native';

export default class LoadingIndicator extends Component {
  static propTypes = {
    size: T.oneOf(['small', 'large']),
    component: T.func
  };

  static defaultProps = {
    size: 'small'
  }

  render() {
    const {Component, style, size, animating} = this.props;
    return (
      <View style={[styles.container,style]}>
        {Component ? 
          Component() : 
            <ActivityIndicatorIOS 
              size={size} animating={animating}/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:10
  }
});
