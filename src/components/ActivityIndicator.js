import React, { PropTypes as T } from 'react'

import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native'

const {width, height} = Dimensions.get('window');

export class ActivityIndicatorComponent extends React.Component {
  static propTypes = {
    height: T.number,
    showing: T.bool,
    size: T.oneOf(['large', 'small'])
  }

  static defaultProps = {
    height: 80,
    showing: true,
    size: 'large'
  }

  render() {
    const {height, animating, size} = this.props;

    return (
      <View style={styles.hudCenter}>
        <ActivityIndicator
          animating={animating}
          style={[styles.centering, {height: height}]}
          size={size}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  hudCenter: {
    backgroundColor: 'transparent',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    width: width,
    top: 0,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
})

export default ActivityIndicatorComponent
