import { StyleSheet } from 'react-native'

import colors from './colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    flexDirection: 'column'
  },
  row: {
    flex: 1,
  },
  rowSeparator: {
    borderWidth: 2,
    borderColor: 'transparent'
  },
  sectionHeader: {
    backgroundColor: colors.white,
    marginBottom: 10,
    padding: 10,
  },
  sectionHeaderText: {
    fontFamily: 'Avenir',
    fontSize: 23,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 10,
    color: colors.dark
  },
})

export default styles
