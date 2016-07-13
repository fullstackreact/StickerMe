import React, { PropTypes as T } from 'react'

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet
} from 'react-native'

import Sticker from './Sticker'

export {Sticker} from './Sticker'

export class StickerPicker extends React.Component {
  static propTypes: {
    photo: T.object
  }

  constructor(props) {
    super(props);

    this.state = {
      scrollEnabled: true
    }
  }

  _draggingStart() {
    this.setState({scrollEnabled: false});
  }

  _draggingStopped() {
    this.setState({scrollEnabled: true});
  }

  _setLocation(evt, sticker, pan, gesture) {
    this.props.setLocation(evt, sticker, pan, gesture);
  }

  render() {
    const {stickers, isDropZone, setLocation} = this.props;

    return (
      <ScrollView style={styles.container}
          scrollEnabled={this.state.scrollEnabled}
          horizontal={true}>
        {stickers.map(sticker => {
          return <Sticker
                    onDrag={this._draggingStart.bind(this)}
                    onDragEnd={this._draggingStopped.bind(this)}
                    isDropZone={isDropZone}
                    setLocation={this._setLocation.bind(this)}
                    style={styles.imageContainer}
                    key={sticker.id}
                    sticker={sticker} />
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
  }
})

export default StickerPicker;
