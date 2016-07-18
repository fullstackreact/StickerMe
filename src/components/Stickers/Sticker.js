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
      scale: new Animated.Value(1),
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
        this.state.pan.flattenOffset();

        if (isDropZone(gesture)) {
          setLocation(e, this.props.sticker, this.state.pan, {gesture})
        } else {
          Animated.spring(
            this.state.pan,
            {toValue: {x:0, y:0}}
          ).start()
        }
      },
      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },
  });

  }

  render() {
    const {sticker, canDrag} = this.props;

    let animatedViewProps = {};
    let animatedStyles = [];

    if (canDrag) {
      let { pan, scale } = this.state;

      animatedStyles = [
        pan.getLayout(),
        styles.container,
        {transform: [{scale}]}
      ]

      if (this.state.x && this.state.y) {
        animatedStyles.concat({
          position: 'absolute',
          y: this.state.y,
          x: this.state.x,
        })
      }

      animatedViewProps = Object.assign({}, this.panResponder.panHandlers);
    }

    return (
      <Animated.View
          {...animatedViewProps}
          style={animatedStyles}>
        <sticker.Component />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    // paddingVertical: 10,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
})

export default Sticker;
