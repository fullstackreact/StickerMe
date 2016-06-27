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

import WelcomeScreen from '../components/Welcome'
import Signup from '../components/Signup'

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
		let { navigationState } = this.props

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
  						style={modal ?
  									NavigationCard.CardStackStyleInterpolator.forVertical(props) :
  									undefined
  						}
  						panHandlers={modal ? null : undefined }
  						renderScene={this._renderScene.bind(this)}
  						key={props.scene.route.key}
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
		const { route } = scene;
    const {key} = route;
    const {actions} = this.props;

    const createElement = (Component) => {
      return React.cloneElement(Component, {
        actions: actions
      })
    }
    if (key === 'welcome') return createElement(<WelcomeScreen />)
    if (key === 'signup') return createElement(<Signup />)
    return (
      <View>
        <Text>Test in _renderScene</Text>
      </View>
    )
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default connect(state => {
  return {
    currentUser: state.currentUser,
    navigationState: state.navigation
  }
})(StickerMe);
