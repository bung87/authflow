import nock from 'nock'
import chai from 'chai'
const expect = chai.expect
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { deferred, fetchLogin, AuthFlowActions } from '../src'

import fetch from 'node-fetch'

const middlewares = [thunk]

/**
 * Creates a mock of Redux store with middleware.
 */
function mockStore(getState: any, expectedActions: any[], onLastAction: () => void) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.')
  }
  if (typeof onLastAction !== 'undefined' && typeof onLastAction !== 'function') {
    throw new Error('onLastAction should either be undefined or function.')
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === 'function' ? getState() : getState
      },

      dispatch(action: any) {
        const expectedAction = expectedActions.shift()
        expect(action).deep.equals(expectedAction)
        if (onLastAction && !expectedActions.length) {
          onLastAction()
        }
        return action
      },
    }
  }
  // @ts-ignore
  const mockStoreWithMiddleware = applyMiddleware(...middlewares)(mockStoreWithoutMiddleware)
  // @ts-ignore
  return mockStoreWithMiddleware()
}

const nockServer = nock('http://example.com/', {
  reqheaders: {
    'Content-Type': 'application/json',
  },
}).defaultReplyHeaders({
  'Content-Type': 'application/json',
})

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates FETCH_TODO_SUCCESS when fetching todos has been done', done => {
    nockServer.post('/login').reply(200, { todos: ['do something'] })

    const expectedActions = [
      { type: AuthFlowActions.loginRequest },
      { type: AuthFlowActions.loginRequestSuccess, playload: { todos: ['do something'] } },
    ]
    const store = mockStore({ todos: [] }, expectedActions, done)
    function login() {
      return fetch('http://example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
        },
        body: JSON.stringify({}),
      }).then((res: any) => res.json())
    }

    let dLogin = deferred(console.log)
    // @ts-ignore
    store.dispatch(fetchLogin(dLogin))
    dLogin.resolve(login())

    dLogin.promise
      .then(() => {
        let dCode = deferred(console.log)
        // @ts-ignore
        // store.dispatch(actions.fetchLogin(dLogin));
        dCode.resolve(233)
        return dCode.promise
      })
      .then(dVerCode => {
        let dCode = deferred(console.log)
        // @ts-ignore
        // store.dispatch(actions.fetchLogin(dLogin));
        dCode.resolve(456)
        return dCode.promise
      })
  })
})
