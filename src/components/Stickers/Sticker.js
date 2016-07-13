import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,

  PanResponder,
  Animated,
  Dimensions
} from 'react-native'

export class Sticker extends React.Component {
  static propTypes: {
    sticker: T.object,
    initialLocation: T.object
  }

  static defaultProps = {
    initialLocation: {},
    onDrag: (e) => e,
    onDragEnd: (e) => e
  }

  constructor(props) {
    super(props);

    const {initialLocation} = this.props;

    this.state = {
      pan: new Animated.ValueXY(),
      x: initialLocation.x,
      y: initialLocation.y,
    }

    const {isDropZone, setLocation} = this.props;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder : () => true,
      onPanResponderMove           : Animated.event([null,{
          dx : this.state.pan.x,
          dy : this.state.pan.y
      }]),
      onPanResponderStart: (e) => this.props.onDrag(e),
      onPanResponderEnd: (e) => this.props.onDragEnd(e),
      onPanResponderRelease        : (e, gesture) => {
        if (isDropZone(gesture)) {
          setLocation(e, this.props.sticker, this.state.pan, {gesture})
        } else {
          Animated.spring(
            this.state.pan,
            {toValue: {x:0, y:0}}
          ).start()
        }
      }
  });

  }

  render() {
    const {sticker} = this.props;
    let animtatedStyles = [this.state.pan.getLayout(), styles.container]

console.log('rendering sticker', this.state);
    if (this.state.x && this.state.y) {
      animtatedStyles.concat({
        position: 'absolute',
        y: this.state.y,
        x: this.state.x,
      })
    }

    return (
      <Animated.View
          {...this.panResponder.panHandlers}
          style={animtatedStyles}>
        <sticker.Component />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative'
  },
  imageContainer: {
    flex: 1,
  }
})

export default Sticker;
