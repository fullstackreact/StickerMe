import React from 'react'

import moment from 'moment'

import {
  View,
  Text,
  Image,
  ScrollView,
  ListView,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import PhotoCard from './PhotoCard';

export class PhotoFeed extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      sectionHeaderHasChanged: this._sectionHeaderHasChanged.bind(this),
      rowHasChanged: this._rowHasChanged.bind(this),
    });

    this.state = {
      dataSource: ds.cloneWithRows(this.props.photos)
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.photos != this.props.photos) {
      const {photos} = nextProps;
      let {data, sectionIds} = this._getListViewData(photos);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(data, sectionIds)
      });
    // }
  }

  render() {
    const { photos, actions } = this.props;

    return (
      <View style={styles.container}>
        <ListView
          ref="listView"
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)} />
      </View>
    )
  }

  _renderSectionHeader(data, sectionId) {
    var text;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  }

  _getListViewData(photos) {
    let data = {};
    let sectionIds = [];

    photos
      .sort((p1, p2) => p1.timestamp < p2.timestamp)
      .map((photo) => {
        const time = moment(photo.timestamp).fromNow();
        let section = photo.name;
        if (sectionIds.indexOf(time) === -1) {
          sectionIds.push(time);
          data[time] = [];
        }
      data[time].push(photo);
    });

    return {data, sectionIds};
  }

  _sectionHeaderHasChanged(oldSection, newSection) {
    return oldSection !== newSection;
  }

  _rowHasChanged(oldRow, newRow) {
    return oldRow !== newRow;
  }

  _pressRow(photo) {
    const {actions} = this.props;
    const {navigation} = actions;

    navigation.push('welcome.photo', {photo})
  }

  _renderRow(rowData) {
    const {actions} = this.props;

    var rowHash = rowData.name;
    return (
      <View style={styles.row}>
        <PhotoCard onPress={this._pressRow.bind(this)}
                actions={actions}
                photo={rowData} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    // flexDirection: 'column'
  },
  row: {
    flex: 1
  },
  rowSeparator: {
  },
  sectionHeader: {
    backgroundColor: '#48D1CC',
  },
  sectionHeaderText: {
    fontFamily: 'Avenir',
    fontSize: 23,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 10,
    color: '#FFFFFF'
  },
})

export default PhotoFeed;
