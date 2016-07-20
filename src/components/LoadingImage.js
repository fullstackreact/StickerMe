import React, { PropTypes as T} from 'react'

import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window');
import colors from '../styles/colors'

export class LoadingImage extends React.Component {

  static propTypes = {
    source: T.oneOfType([T.object, T.string]).isRequired,
    loadImage: T.func,
    backgroundColor: T.string,
  };

  static defaultProps = {
    backgroundColor: colors.white,
    style: [],
    imageStyle: []
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      thumbnailOpacity: new Animated.Value(0)
    }
  }

  onLayout() {
    this.props.loadImage(this.props);
  }

  onLoad() {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250
    }).start()
    const listenerId = this.state.thumbnailOpacity.addListener(() => {
      this.state.thumbnailOpacity.removeListener(listenerId);
      this.setState({loading: false});
    });
  }

  render() {
    const {photo, source, loadImage, style, imageStyle, backgroundColor} = this.props;
    const {thumbnailOpacity} = this.state;

    return (
      <View
        key={source}
        style={[
          {flex: 1},
          style
        ]}
        onLayout={this.onLayout.bind(this)}
        backgroundColor={backgroundColor}>
          <ActivityIndicator
            animating={this.state.loading}
            style={[
              styles.centering,
              {height: 80},
            ]}
            size="large" />
          <Animated.Image
            resizeMode={'contain'}
            style={[
              {position: 'absolute', top: 0, left: 0, width: width, height: height},
              {opacity: thumbnailOpacity},
              imageStyle
            ]}
            source={source}
            onLoad={this.onLoad.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
})

export default LoadingImage
