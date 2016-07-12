import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

export class NoMedia extends React.Component {
  takePicture() {
    console.log('take picture');
    const {actions} = this.props;
    actions.navigation.push('camera.take')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>You don't have any photos yet</Text>
        <Text>Why not take a snap and get this party started?</Text>

          <TouchableHighlight style={styles.capture}
                underlayColor={'transparent'}
                onPress={this.takePicture.bind(this)}>
            <View style={styles.cameraButton}>
              <Icon name="camera" size={60} color={'#999'} />
            </View>
          </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraButton: {
    paddingTop: 20,
    alignSelf: 'center',
    justifyContent: 'center'
  }
})

export default NoMedia
