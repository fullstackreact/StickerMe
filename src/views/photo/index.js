import React, { PropTypes as T } from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,

  Animated,
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
const size = 60
const stickers = [
  {
    id: 1,
    name: 'Flag',
    Component: () => <Icon size={size} name="flag" />
  },
  {
    id: 2,
    name: 'Bolt',
    Component: () => <Icon size={size} name="bolt" />
  },
  {
    id: 3,
    name: 'Thumbs up',
    Component: () => <Icon size={size} name='thumbs-up' />
  }
]

import StickerPicker, {Sticker} from '../../components/Stickers'

console.log('Sticker ->', Sticker);

export class PhotoView extends React.Component {
  static propTypes: {
    photo: T.object
  }

  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropZoneValues: null,
      pan: new Animated.ValueXY(),

      stickers: []
    }
  }

  setDropZoneValues(event){      //Step 1
    this.setState({
      dropZoneValues : event.nativeEvent.layout
    });
  }

  isDropZone(gesture) {
    const dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setLocation({nativeEvent}, sticker, pan, gesture) {
    console.log('setLocation ->', Sticker);

    const newSticker = Object.assign({}, sticker, {
      initialLocation: {x: nativeEvent.pageX, y: nativeEvent.pageY}
    })

    console.log('nativeEvent --->', nativeEvent);

    this.setState({
      stickers: this.state.stickers.concat(newSticker)
    })
  }

/*
  <Image
    style={styles.imageContainer}
    source={{uri: photo.url }} />*/
  render() {
    const {actions} = this.props;
    const {routeProps} = this.props.route;
    const {photo} = routeProps;

    return (
      <View style={styles.container}>
        <View style={styles.image}
              onLayout={this.setDropZoneValues.bind(this)}>
          {this.state.stickers.map(sticker => {
            return <Sticker
                    key={sticker.id}
                    sticker={sticker} />
          })}
        </View>
        <View style={styles.picker}>
          <StickerPicker
            isDropZone={this.isDropZone.bind(this)}
            setLocation={this.setLocation.bind(this)}
            stickers={stickers}
            actions={actions} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 6
  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})

export default PhotoView;
