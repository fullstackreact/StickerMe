import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'

export class PhotoCard extends React.Component {
  static propTypes = {
    photo: T.object,
    actions: T.object
  }

  componentDidMount() {
    const {actions, photo} = this.props;
    actions.photos.downloadPhoto(photo)
  }

  render() {
    const {photo} = this.props;

    return (
      <View style={styles.container}>
        {photo.url && <Image source={{uri: photo.url}}
               style={[styles.base, {overflow: 'hidden'}]} />}
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
