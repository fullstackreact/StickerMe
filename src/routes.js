import React from 'react'
import {
  View, Text, TouchableHighlight
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Close from './components/Close'

const toList = (root) => {
  const visitRoute = (key, node, hash={}, prefix=[]) => {
    const keyPrefix = prefix.concat(key);
    const routeNestedKey = keyPrefix.join('.');

    const routeObj = Object.assign({}, node.route || {}, {
      key: routeNestedKey, routeKey: key, keyPrefix
    });
    hash[routeNestedKey] = routeObj;

    if (node.children) {
      prefix.push(key);
      Object.keys(node.children).forEach(childKey => {
        return visitRoute(childKey, node.children[childKey], hash, prefix)
      });
    }

    return hash;
  }

  // Root keys
  let routes = {};
  Object.keys(root).map(key => visitRoute(key, root[key], routes));
  return routes;
}
export const routes = toList({
  'welcome': {
    route: {
      title: 'Home',
      rightComponent: function (props) {
        const {scene} = props;
        const takePicture = () => {
          const {actions} = props.scene.route;
          const {navigation} = actions;
          navigation.push('camera.take');
        }
        return (
          <View style={{padding: 10}}>
            <TouchableHighlight onPress={takePicture}>
              <Icon name="camera" size={20} />
            </TouchableHighlight>
          </View>
        )
      }
    }
  },
  'camera': {
    route: {noHeader: true},
    children: {
      'take': {
        route: {
          noHeader: true,
          modal: true,
          Component: () => {
            const C = require('./views/camera/takePicture').default;
            return <C />
          }
        }
      }
    }
  },
  'public': {
    route: {},
    children: {
      'signup': {
        route: {
          title: 'Sign up',
          modal: true,
          headerStyle: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0
          },
          leftComponent: null,
          rightComponent: (props) => {
            const onClose = () => {
              const {actions} = props.scene.route;
              const {navigation} = actions;
              navigation.pop();
            }
            return (<Close onPress={onClose}/>)
          }
        }
      }
    }
  }
})

export default routes;
