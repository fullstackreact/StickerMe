import React, {PropTypes} from 'react'
import {View, Text, StyleSheet} from 'react-native'

import Close from '../components/Close'
import Button from '../components/Button'

const Signup = (props) => {
  const onClose = () => {
    const {navigation} = props.actions;
    navigation.pop();
  }
  const signupWith = (provider) => (evt) => {
    const {currentUser} = props.actions;
    currentUser.signUpWith(provider)
  }
	return (
		<View style={styles.container}>
      <View style={styles.providerContainer}>
        <Button onPress={signupWith('twitter')}>
          <Text>Sign up with Twitter</Text>
        </Button>
      </View>
      <View style={styles.contentContainer}>
			   <Text style={styles.title}>This is a Modal Screen</Text>
      </View>
		</View>
	)
}

Signup.propTypes = {
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  providerContainer: {
    flex: 1,
    backgroundColor: '#ff66bb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    flexDirection: 'row'
  },
  provider: {
    fontSize: 24
  },
	contentContainer: {
		flex: 2,
		backgroundColor: '#cea76a',
		justifyContent: 'center',
		alignItems: 'center'
	},
  closeBtn: {
    // top: 40,
    // right: 0,
    // position: 'absolute',
  },
	title: {
		fontSize: 24,
		fontWeight: '500',
		color: '#ffffff',
		marginBottom: 30
	}
})

export default Signup
