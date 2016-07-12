'use strict';
import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import RNFS from 'react-native-fs'
import Camera from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'

export class TakeAPhoto extends React.Component {
  componentDidMount() {
    console.log('TakeAPhoto() props', this.props);
    // this.takePicture();
  }
  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          captureTarget={Camera.constants.CaptureTarget.temp}
          captureAudio={false}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>

          <TouchableHighlight style={styles.capture}
                      underlayColor={'transparent'}
                      onPress={this.takePicture.bind(this)}>
            <View style={styles.cameraButton}>
              <Icon name="camera" size={60} color={'#999'} />
            </View>
          </TouchableHighlight>

        </Camera>
      </View>
    );
  }

  takePicture() {
    const {actions} = this.props;
    const {navigation, photos} = actions;

    this.camera.capture()
      .then(({path}) => {
          photos.uploadPhoto(path, {
            contentType: 'image/jpeg',
            contentEncoding: 'base64',
          });
          navigation.pop();
          navigation.pop();
      })
      .catch(err => {
        console.error(err)
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 1
  },
  cameraButton: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  }
});

export default TakeAPhoto
