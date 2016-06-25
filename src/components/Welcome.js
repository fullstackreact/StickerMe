import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import AppIntro from 'react-native-app-intro';

export class Welcome extends React.Component {
  onLogin() {
    console.log('onLogin called');
  }

  onSignup() {
    const {navigation} = this.props.actions;
    navigation.push({key: 'signup', modal: true, title: 'Signup'})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <AppIntro
            customStyles={{
              flex: 1
            }}
            defaultIndex={0}
            renderSkipButton={false}
            renderDoneButton={false}
            paginationStyles={{
              bottom: 100
            }}
            dotStyles={{
              width: 8,
              height: 8,
            }}>
            <View style={[styles.slide]}>
              <View>
                <Text style={styles.heading}>
                  Welcome screen
                </Text>
              </View>
            </View>
            <View style={[styles.slide]}>
            <View>
              <Text style={styles.heading}>
                Welcome screen
              </Text>
            </View>
            </View>
          </AppIntro>
        </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={this.onSignup.bind(this)}
          style={styles.button}>
            <Text style={styles.btnText}>
              Sign up
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onLogin.bind(this)}
          style={styles.button}>
            <Text style={styles.btnText}>
              Sign up
            </Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  introContainer: {
    flex: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 80,
    backgroundColor: '#bbc',
    margin: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 24
  },
  btnText: {
    fontSize: 18,
    color: '#ffffff'
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#abbccd',
  }
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'column'
//   },
//   getStartedBtn: {
//     flex: 0.5,
//     backgroundColor: 'blue'
//   },
//   slide: {
//     flex: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#abcccd'
//   }
// })

export default Welcome
