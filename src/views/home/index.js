import React from 'react';
import {connect} from 'react-redux'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import NoMedia from './NoMedia'
import PhotoFeed from '../../components/PhotoFeed'

export class HomeView extends React.Component {
  componentDidMount() {
    const {actions} = this.props;
    actions.photos.listen();
  }

  componentWillUnmount() {
    const {actions} = this.props;
    actions.feed.unlisten();
  }

  render() {
    const {actions, photos} = this.props;

    return (
      <View style={styles.container}>
        { photos.items.length === 0 ?
            <NoMedia actions={actions} /> :
            <PhotoFeed actions={actions} photos={photos.items} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center'
  },

});

export default connect(state => ({
  photos: state.photos
}))(HomeView);
