import * as React from 'react'
import { render } from '@testing-library/react-native'
import { Avatar } from '../Avatar'
import { AppContext } from 'appContext'
import * as hooks from 'utils/hooks'

jest.mock('utils/hooks', () => {
  const startAnimationMock = jest.fn(() => Promise.resolve(true))
  return {
    ...jest.requireActual('utils/hooks') as any,
    startAnimationMock,
    useAnimation: jest.fn((value: number) => ({
      startSpring: startAnimationMock,
      value,
    })),
  }
})



describe('Avatar component', () => {
  it('Should render comoponent image', async () => {
    expect.hasAssertions()

    const { findByTestId } = render(
      <AppContext.Provider value={ { activeContactIndex: 3 } }>
        <Avatar image={ 2 } index={ 1 } />
      </AppContext.Provider>
    )

    const image = await findByTestId('AvatarImage')

    expect(image).toBeTruthy()
  })

  it('Should set active animation vakue to 0 on initial render when avatar is not active', async () => {
    expect.hasAssertions();
    (hooks.useAnimation as jest.MockedFunction<any>).mockClear();
    (hooks as any).startAnimationMock.mockClear()

    render(
      <AppContext.Provider value={ { activeContactIndex: 3 } }>
        <Avatar image={ 2 } index={ 1 } />
      </AppContext.Provider>
    )

    expect((hooks.useAnimation as jest.MockedFunction<any>).mock.calls[0][0]).toBe(0)
    expect((hooks as any).startAnimationMock.mock.calls.length).toBe(0)
  })

  it('Should set active animation vakue to 1 on initial render when avatar is active', async () => {
    expect.hasAssertions();
    (hooks.useAnimation as jest.MockedFunction<any>).mockClear();
    (hooks as any).startAnimationMock.mockClear()

    render(
      <AppContext.Provider value={ { activeContactIndex: 3 } }>
        <Avatar image={ 2 } index={ 3 } />
      </AppContext.Provider>
    )


    expect((hooks.useAnimation as jest.MockedFunction<any>).mock.calls[0][0]).toBe(1)
    expect((hooks as any).startAnimationMock.mock.calls.length).toBe(0)
  })

  it('Should animate when Avatar becomes active', async () => {
    expect.hasAssertions();
    (hooks.useAnimation as jest.MockedFunction<any>).mockClear();
    (hooks as any).startAnimationMock.mockClear()

     const { update } = render(
      <AppContext.Provider value={ { activeContactIndex: 3 } }>
        <Avatar image={ 2 } index={ 1 } />
      </AppContext.Provider>
    )

    update(
      <AppContext.Provider value={ { activeContactIndex: 1 } }>
        <Avatar image={ 2 } index={ 1 } />
      </AppContext.Provider>
    )


    expect((hooks as any).startAnimationMock.mock.calls.length).toBe(1)
    expect((hooks as any).startAnimationMock.mock.calls[0]).toMatchSnapshot()
  })
})
