import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { commonStyles } from 'constants/'

interface DetailsProps {
  fisrtName: string
  lastName: string
  jobTitle: string
  bio: string
}

export const Details: React.FunctionComponent<DetailsProps> = (props): React.ReactElement => {
  return (
    <View style={ styles.container }>
      <Text style={ commonStyles.header1 }>
        {`${ props.fisrtName} ` }
        <Text style={ styles.lastName } >{ props.lastName }</Text>
      </Text>
      <Text style={ commonStyles.body }>{ props.jobTitle }</Text>
      <Text style={ [commonStyles.header2, styles.about] }>About me</Text>
      <Text style={ [commonStyles.body, styles.bio] }>{ props.bio }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  about: {
    alignSelf: 'flex-start',
    marginTop: 40,
    marginBottom: 10,
  },
  bio: {
    alignSelf: 'stretch',
  },
  lastName: {
    fontWeight: '400',
  },
})
