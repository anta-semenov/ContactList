import * as React from 'react'
import { render } from '@testing-library/react-native'
import { Details } from '../Details'

describe('Details component', () => {
  it('Should render data', async () => {
    expect.hasAssertions()
    const { findByText } = render(<Details fisrtName='FirstName' lastName='LastName' jobTitle='TestJob' bio='TestBio'/>)

    const name = await findByText('FirstName LastName')
    const job = await findByText('TestJob')
    const bio = await findByText('TestBio')
    const aboutTitle = await findByText('About me')

    expect(name).toBeTruthy()
    expect(job).toBeTruthy()
    expect(bio).toBeTruthy()
    expect(aboutTitle).toBeTruthy()
  })
})
