import React, {
  Children
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity
} from 'react-native'

export class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: new Animated.Value(0),
    }
  }

  renderButton() {
    const {children} = this.props;
    const props = Object.assign({}, this.props, {});
    return (
      <View style={styles.buttonContent}>
        <Text style={ this.props.labelStyle }>
          {Children.map(children, c => React.cloneElement(c, props))}
        </Text>
      </View>
    );
  }

  onPress(evt) {
    if (this.props.onPress) {
      this.props.onPress(evt);
    }
  }

  render() {
    const animatedStyles = [
      styles.button,
      {backgroundColor: '#bbcc33'}
    ]
    return (
      <TouchableOpacity style={styles.wrapper}
      activeOpacity={this.props.activeOpacity}
      onPress={ this.onPress.bind(this) }>
        <Animated.View
          style={animatedStyles}>
            {this.renderButton()}
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  button: {
    flex: 1,
    height: 10,
    backgroundColor: '#477CCC',
    borderRadius: 2
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  }
})

export default Button;
