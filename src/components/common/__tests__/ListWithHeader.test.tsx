import * as React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { ListWithHeader } from '../ListWithHeader'

describe('ListWithHeader', () => {
  it('Should render header and details', async () => {
    jest.setTimeout(6000)
    expect.hasAssertions()
    const testData = [
      { id: 1, data: 'test1' },
      { id: 2, data: 'test2' },
    ]
    const { findByTestId } = render(<ListWithHeader
      items={ testData }
      renderHeaderItem={ (info) => <Text style={ { width: 100 } } testID='HeaderComponent'>{ info.item.data }</Text>}
      renderDetailsItem={ (info) => <Text testID='DetailsComponent'>{ info.item.data }</Text> }
      headerItemSize={ { width: 100, height: 100 } }
    />)

    const headerScroll = await findByTestId('HeaderScroll')
    const detailsScroll = await findByTestId('DetailsScroll')

    expect(headerScroll).toBeTruthy()
    expect(detailsScroll).toBeTruthy()
  })
})
