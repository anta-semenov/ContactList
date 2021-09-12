import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { AppContext } from 'appContext'
import { Avatar, Details, ListWithHeader } from 'components'
import { contacts } from './data/contacts'
import { avatarSize } from 'constants/'

export const App: React.FunctionComponent = () => {
  const [activeContactIndex, setActiveContactIndex] = React.useState(0)



  return (
    <AppContext.Provider value={ { activeContactIndex } }>
      <SafeAreaView style={ { backgroundColor: '#e8e8e8' } }>
        <StatusBar barStyle={ 'dark-content' } />
        <View style={ styles.header }>
          <Text style={ styles.headerTitile }>Contacts</Text>
        </View>
        <ListWithHeader
          headerItemSize={ { width: avatarSize, height: avatarSize + 10 } }
          items={ contacts }
          renderHeaderItem={ (info) => <Avatar image={ info.item.avatar } index={ info.index }/> }
          renderDetailsItem={ (info) => (
            <Details
              fisrtName={ info.item.firstName }
              lastName={ info.item.lastName }
              jobTitle={ info.item.job }
              bio={ info.item.bio }
            />
          ) }
          style={ styles.contentContainer }
          onActiveItemChange={ (value) => setActiveContactIndex(value) }
          headerContainerStyle={ { marginTop: 10 } }
        />
      </SafeAreaView>
    </AppContext.Provider>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitile: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '400',
  },
  contentContainer: {
    backgroundColor: '#ffffff',
  },
})
