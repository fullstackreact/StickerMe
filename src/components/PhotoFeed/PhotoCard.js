import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import LoadingImage from '../LoadingImage'

export class PhotoCard extends React.Component {
  static propTypes = {
    photo: T.object,
    actions: T.object,
    onPress: T.func
  }

  componentDidMount() {
    const {actions, photo} = this.props;
  }

  onPress(evt) {
    this.props.onPress(this.props.photo)
  }

  componentWillReceiveProps(nextProps) {
    console.log('PhotoCard() componentWillReceiveProps',
      nextProps.photo ? nextProps.photo : 'No photo key');
  }

  render() {
    const {photo, actions} = this.props;

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.onPress.bind(this)}>
          <View>
            <LoadingImage
              photo={photo}
              style={styles.base}
              imageStyle={styles.image}
              source={{uri: photo.url}}
              loadImage={() => actions.photos.downloadThumbnail(photo.fullPath, photo)} />
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // height: 90,
  },
  base: {
    flex: 1,
    height: 120,
  },
  image: {
    flex: 1,
    height: 120,
    resizeMode: 'cover'
  }
})

export default PhotoCard;
