import React, { Children, PropTypes as T } from 'react';
import {connect} from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  NavigationExperimental,
  Easing,
  TouchableHighlight
} from 'react-native';

const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
	Header: NavigationHeader,
  CardStack: NavigationCardStack,
} = NavigationExperimental

import Public from '../views/public'
import Home from '../views/home'
import WelcomeScreen from '../components/Welcome'
import Signup from '../components/Signup'

const hasHeader = (route) => !route.noHeader

class StickerHeader extends React.Component {
  render() {
    return React.cloneElement(<NavigationHeader
            {...this.props}
            onNavigateBack={this._onBack.bind(this)} />, {})

    return Header;
  }

  _onBack() {
  }
}

class StickerNavigator extends React.Component {
  static propTypes = {
    navigate: T.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let {navigationState, currentUser} = this.props

    const stackKey = `stack_${(currentUser ? currentUser.uid : 'public')}`

    return (
      <View style={styles.container}>
        <NavigationCardStack
          key={stackKey}
          onNavigateBack={this._back}
          navigationState={navigationState}
          renderOverlay={this._renderHeader.bind(this)}
          renderScene={this._renderScene.bind(this)}
        />
      </View>
    )
  }

  _renderHeader(sceneProps) {
    const {actions} = this.props;
    const {scene} = sceneProps;
    const {route} = scene;

    if (!route.noHeader) {
      route.actions = actions;
      const {headerStyle} = route;
      let headerProps = Object.assign({}, sceneProps, {
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

      return (<StickerHeader {...headerProps} />)
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
    } else if (keyPrefix && keyPrefix[0] === 'public') {
      Component = <Public />
    } else {
      Component = <View>
        <Text>Scene not yet implemented</Text>
      </View>
    }

    return (
      <View key={route.key}
            style={[styles.scene, !noHeader && styles.sceneWithHeader]}>
        {createElement(Component)}
      </View>
    )
	}
}

export class StickerMe extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const {actions} = this.props;
    actions.currentUser.init();
  }

  _navigate({type}) {
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
      <StickerNavigator
        {...this.props}
        navigationState={navigationState}
        navigate={this._navigate.bind(this)}
        />
    )
  }

/*
    // return (
    //   <NavigationCardStack
    //     onNavigate={this.onNavigate.bind(this)}
    //     navigationState={navigationState}
    //     renderOverlay={this._renderOverlay.bind(this)}
    //     renderScene={props => {
    //       const {modal} = props.scene.route;
    //       return (
  	// 				<NavigationCard
  	// 					{...props}
    //           currentUser={this.props.currentUser}
  	// 					style={modal ?
  	// 								NavigationCard.CardStackStyleInterpolator.forVertical(props) :
  	// 								undefined
  	// 					}
  	// 					panHandlers={modal ? null : undefined }
  	// 					renderScene={this._renderScene.bind(this)}
  	// 					key={props.scene.route.key + !!this.props.currentUser}
  	// 				/>
  	// 			)
    //     }}
    //     style={styles.navigator}
    //   />
    // );

		return (
			<NavigationTransitioner
				navigationState={navigationState}
				style={styles.container}
				onNavigate={this.onNavigate.bind(this)}
				renderOverlay={this._renderOverlay.bind(this)}
        configureTransition={this._configureTransition.bind(this)}
        render={(props) => this._render(props)}
			/>
		)
	}
  */

  _render(
    transitionProps: NavigationTransitionProps,
  ): Array<ReactElement<any>> {
    return transitionProps.scenes.map((scene) => {
      const sceneProps = {
        ...transitionProps,
        scene,
      };
      return this._renderScene(sceneProps);
    });
  }

  _configureTransition() {
    const easing = Easing.inOut(Easing.ease);
    return {
      duration: 500,
      easing
    }
  }
  //
  // _renderOverlay(props) {
  //   const {actions} = this.props;
  //   const {route} = props.scene;
  //
  //   if (!route.noHeader) {
  //     route.actions = actions;
  //     const {headerStyle} = route;
  //     let headerProps = Object.assign({}, props, {
  //       route,
  //       style: headerStyle || {}
  //     });
  //
  //     const {title, titleComponent} = route;
  //     if (title && title != false) {
  //       headerProps.renderTitleComponent = (props) => {
  //         return titleComponent ?
  //                 titleComponent(props) : (<NavigationHeader.Title>{title}</NavigationHeader.Title>);
  //       }
  //     }
  //
  //     const {leftComponent, rightComponent} = route;
  //     headerProps.renderLeftComponent = leftComponent ?
  //         leftComponent : () => (<View />)
  //     headerProps.renderRightComponent = rightComponent ?
  //         rightComponent : () => (<View />)
  //
  //     return (<NavigationHeader {...headerProps} />)
  //   }
  // }
  //
	// _renderScene({scene}) {
	// 	const {route} = scene;
  //   const {keyPrefix} = route;
  //   const {actions, currentUser} = this.props;
  //   const {noHeader} = route;
  //
  //   const createElement = (Component) => {
  //     return React.cloneElement(Component, {
  //       actions: actions,
  //       route,
  //       currentUser,
  //       style: { flex: 1 }
  //     })
  //   }
  //
  //   let Component;
  //
  //   if (route.Component) {
  //     Component = route.Component;
  //     if (typeof Component === 'function') {
  //       Component = Component(route)
  //     }
  //   } else if (!!currentUser) {
  //     Component = <Home />
  //   } else if (keyPrefix[0] === 'public') {
  //     Component = <Public />
  //   } else {
  //     Component = <View>
  //       <Text>Scene not yet implemented</Text>
  //     </View>
  //   }
  //
  //
  //   return (
  //     <View key={route.key}
  //           style={[!noHeader && styles.sceneWithHeader]}>
  //       {createElement(Component)}
  //     </View>
  //   )
	// }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 20,
  },
  sceneWithHeader: {
    marginTop: 65,
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
