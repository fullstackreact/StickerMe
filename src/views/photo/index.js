import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'

export class PhotoView extends React.Component {
  static propTypes: {
    photo: T.object
  }

  render() {
    const {routeProps} = this.props.route;
    const {photo} = routeProps;

    return (
      <View style={styles.container}>
        <Image
          style={styles.imageContainer}
          source={{uri: photo.url }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageContainer: {
    flex: 1,
    borderBottomWidth: 10
  }
})

export default PhotoView;
