import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux'

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ListView
} from 'react-native'

import StickerPicker, {Sticker} from '../../components/Stickers'
import Button from '../../components/Button'
import LoadingImage from '../../components/LoadingImage';

import tableStyles from '../../styles/tableStyles'

export class BuyScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    const ds = new ListView.DataSource({
      sectionHeaderHasChanged: this._sectionHeaderHasChanged.bind(this),
      rowHasChanged: this._rowHasChanged.bind(this),
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections([], [])
    }
  }

  componentDidMount() {
    this.props.actions.products.listen();
  }

  componentWillUnmount() {
    this.props.actions.products.unlisten();
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.productErrors && nextProps.productErrors.length > 0) {
      console.log('productErrors', nextProps.productErrors);
      return;
    }

    if (nextProps.products !== this.props.products) {
      let {data, sectionIds} = this._getListViewData(nextProps);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(data, sectionIds)
      });
    }
  }

  render() {
    const {products, actions} = this.props;
    const {dataSource} = this.state;

    return (
      <View style={[tableStyles.container, styles.container]}>
        <ListView
          ref="listView"
          automaticallyAdjustContentInsets={false}
          dataSource={dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)} />
      </View>
    )
  }

  _getListViewData(nextProps) {
    const {products, actions} = nextProps;

    let data = {};
    let sectionIds = [];

    Object.keys(products)
      .map((id) => {
        const product = products[id];
        const productName = product.name;

        // const time = moment(photo.timestamp).fromNow();
        let section = productName;
        if (sectionIds.indexOf(productName) === -1) {
          sectionIds.push(productName);
          data[productName] = [];
        }

        const productList = product.products.map(p => {
          // Download the thumbnail url if not available
          return p;
        });
        data[productName].push({productName, products: productList});
    });

    return {data, sectionIds};
  }


  _sectionHeaderHasChanged(oldSection, newSection) {
    return oldSection !== newSection;
  }

  _rowHasChanged(oldRow, newRow) {
    return oldRow !== newRow;
  }

  _renderRow(rowData) {
    const {actions} = this.props;

    return (
      <ScrollView style={[]}
          key={`row_${rowData.id}`}
          horizontal={true}>
            {rowData.products.map(product => {
              return (
                <LoadingImage
                    key={product.id}
                    style={[{width: 50, height: 50}, styles.thumbnailContainer]}
                    loadImage={() => actions.products.downloadThumbnail(product.thumbnail, product)}
                    source={{uri: product.thumbnail_url}} />
              )
          })}
      </ScrollView>
    )
  }

  _buyStickers(sectionId) {
    console.log('buyStickers called', sectionId);
  }

  _renderSectionHeader(data, sectionId) {
    var text;
    return (
      <View style={[styles.sectionHeader, tableStyles.sectionHeader]}>
        <Text style={[styles.sectionHeaderText, tableStyles.sectionHeaderText]}>{sectionId}</Text>
        <Button color={'#ffffff'}
                activeOpacity={0.3}
                style={styles.sectionHeaderBtn}
                onPress={this._buyStickers.bind(this, sectionId)}>
          <Text>Get it</Text>
        </Button>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    var style = tableStyles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionHeaderText: {
    flex: 3,
  },
  sectionHeaderBtn: {
    flex: 1,
  },
  thumbnailContainer: {
    flex: 1,
    borderWidth: 3,
    borderColor: 'transparent',
    padding: 10,
  }
})

export default connect(state => ({
  products: state.products.items,
  productErrors: state.products.errors
}))(BuyScreen)
