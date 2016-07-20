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

const noop = (e) => e
export class StickerPicker extends React.Component {
  static propTypes: {
    photo: T.object,
    onDrag: T.func,
    onDragEnd: T.func,
    setLocation: T.func,
    canScroll: T.func
  }

  static defaultProps: {
    onDrag: noop,
    onDragEnd: noop,
    setLocation: noop,
    canScroll: () => true
  }

  render() {
    const {renderSticker, canScroll, stickers, isDropZone, onDrag, onDragEnd, setLocation, style} = this.props;

    return (
      <ScrollView style={[styles.container, style]}
          contentContainerStyle={style}
          scrollEnabled={canScroll}
          horizontal={true}>
        {stickers.map(sticker => {
          return React.cloneElement(renderSticker(sticker, {
            key: sticker.id,
            sticker,
            style: [styles.imageContainer]
          }))
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 10,
    borderColor: 'transparent',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 1,
  }
})

export default StickerPicker;
