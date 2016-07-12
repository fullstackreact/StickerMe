import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

export class PhotoCard extends React.Component {
  static propTypes = {
    photo: T.object,
    actions: T.object,
    onPress: T.func
  }

  componentDidMount() {
    const {actions, photo} = this.props;
    actions.photos.downloadPhoto(photo)
  }

  onPress(evt) {
    this.props.onPress(this.props.photo)
  }

  render() {
    const {photo} = this.props;

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.onPress.bind(this)}>
          {photo.url ? <Image source={{uri: photo.url}}
               style={[styles.base, {overflow: 'hidden'}]} /> :
             <Text>Loading...</Text>}
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
    // paddingTop: 80,
    height: 90,
    flex: 1,
    resizeMode: 'cover',
  },
})

export default PhotoCard;
