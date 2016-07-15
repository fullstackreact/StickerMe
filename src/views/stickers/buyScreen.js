import React, { PropTypes as T } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ListView
} from 'react-native'

export class BuyScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    const ds = new ListView.DataSource({
      sectionHeaderHasChanged: this._sectionHeaderHasChanged.bind(this),
      rowHasChanged: this._rowHasChanged.bind(this),
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  render() {
    return (
      <View>
        <Text>Buy stuff</Text>
      </View>
    )
  }

  _sectionHeaderHasChanged(oldSection, newSection) {
    return oldSection !== newSection;
  }

  _rowHasChanged(oldRow, newRow) {
    return oldRow !== newRow;
  }

  _renderRow(rowData) {
    const {actions} = this.props;

    var rowHash = rowData.name;
    return (
      <View style={styles.row}>
        <Text>rowHash</Text>
      </View>
    );
  }
}

export default BuyScreen
