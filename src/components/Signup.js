import React, {PropTypes} from 'react'
import {View, Text, StyleSheet} from 'react-native'

const Signup = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>This is a Modal Screen</Text>
		</View>
	)
}

Signup.propTypes = {
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#cea76a',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 24,
		fontWeight: '500',
		color: '#ffffff',
		marginBottom: 30
	}
})

export default Signup
