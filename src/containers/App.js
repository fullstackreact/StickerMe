import React, { Children } from 'react';
import {connect} from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  NavigationExperimental
} from 'react-native';

const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
	Header: NavigationHeader,
} = NavigationExperimental

import Public from '../views/public'
import Home from '../views/home'
import WelcomeScreen from '../components/Welcome'
import Signup from '../components/Signup'

const hasHeader = (route) => !route.noHeader

export class StickerMe extends React.Component {
  componentDidMount() {
    const {actions} = this.props;
    actions.currentUser.init();
  }

  onNavigate({type}) {
    const {actions} = this.props;
    if (type && (
      type === 'BackAction' ||
      type === NavigationCard.CardStackPanResponder.Actions.BACK.type)
    ) {
      actions.navigation.pop();
    } else {
      actions.navigation.push(action)
    }
  }

  render() {
		let {navigationState} = this.props

		return (
			<NavigationTransitioner
				navigationState={navigationState}
				style={styles.container}
				onNavigate={this.onNavigate.bind(this)}
				renderOverlay={this._renderOverlay.bind(this)}
				renderScene={props => {
          const {modal} = props.scene.route;
          return (
  					<NavigationCard
  						{...props}
              currentUser={this.props.currentUser}
  						style={modal ?
  									NavigationCard.CardStackStyleInterpolator.forVertical(props) :
  									undefined
  						}
  						panHandlers={modal ? null : undefined }
  						renderScene={this._renderScene.bind(this)}
  						key={props.scene.route.key + !!this.props.currentUser}
  					/>
  				)
        }}
			/>
		)
	}

  _renderOverlay(props) {
    const {actions} = this.props;
    const {route} = props.scene;

    if (!route.noHeader) {
      route.actions = actions;
      const {headerStyle} = route;
      let headerProps = Object.assign({}, props, {
        route,
        style: headerStyle || {}
      });

      const {title, titleComponent} = route;
      if (title && title != false) {
        headerProps.renderTitleComponent = (props) => {
          return titleComponent ?
                  titleComponent(props) : (<NavigationHeader.Title>{title}</NavigationHeader.Title>);
        }
      }

      const {leftComponent, rightComponent} = route;
      headerProps.renderLeftComponent = leftComponent ?
          leftComponent : () => (<View />)
      headerProps.renderRightComponent = rightComponent ?
          rightComponent : () => (<View />)

      return (<NavigationHeader {...headerProps} />)
    }
  }

	_renderScene({scene}) {
		const {route} = scene;
    const {keyPrefix} = route;
    const {actions, currentUser} = this.props;
    const {noHeader} = route;

    const createElement = (Component) => {
      return React.cloneElement(Component, {
        actions: actions,
        route,
        currentUser,
        style: { flex: 1 }
      })
    }

    let Component;

    if (route.Component) {
      Component = route.Component;
      if (typeof Component === 'function') {
        Component = Component(route)
      }
    } else if (!!currentUser) {
      Component = <Home />
    } else if (keyPrefix[0] === 'public') {
      Component = <Public />
    } else {
      Component = <View>
        <Text>Scene not yet implemented</Text>
      </View>
    }

    return (
      <View style={[styles.scene, !noHeader && styles.sceneWithHeader]}>
        {createElement(Component)}
      </View>
    )
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scene: {
    flex: 1,
  },
  sceneWithHeader: {
    paddingTop: 65,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

export default connect(state => {
  return {
    currentUser: state.currentUser.user,
    navigationState: state.navigation
  }
})(StickerMe);
