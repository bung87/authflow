// import promised from 'chai-as-promised';
import nock from 'nock';
// chai.use(promised);
import chai from 'chai'
const expect = chai.expect;
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as actions from './actions'
import types from './action_types'
import {Deferred} from "ts-deferred";
import fetch from 'node-fetch';

const middlewares = [thunk];

/**
 * Creates a mock of Redux store with middleware.
 */
function mockStore(getState:any, expectedActions:any[], onLastAction:()=>void) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }
  if (typeof onLastAction !== 'undefined' && typeof onLastAction !== 'function') {
    throw new Error('onLastAction should either be undefined or function.');
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === 'function' ?
          getState() :
          getState;
      },

      dispatch(action:any) {
        const expectedAction = expectedActions.shift();
        expect(action).deep.equals(expectedAction);
        if (onLastAction && !expectedActions.length) {
          onLastAction();
        }
        return action;
      }
    }
  }
  // @ts-ignore
  const mockStoreWithMiddleware = applyMiddleware(...middlewares)(mockStoreWithoutMiddleware);
  // @ts-ignore
  return mockStoreWithMiddleware();
}

const nockServer =  nock('http://example.com/',{
    reqheaders:{
        'Content-Type':'application/json'
    }
})
.defaultReplyHeaders({
    'Content-Type': 'application/json',
  })

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates FETCH_TODO_SUCCESS when fetching todos has been done', (done) => {
   
      nockServer.post('/login')
      .reply(200, { todos: ['do something'] });

    const expectedActions = [
      { type: types.loginRequest },
      { type: types.loginRequestSuccess, playload: { todos: ['do something']  } }
    ]
    const store = mockStore({ todos: [] }, expectedActions, done);
    function login(){
        return fetch('http://example.com/login',{method:'POST',headers:{
            'Content-Type': 'application/json'
        // @ts-ignore
        },body:JSON.stringify({})}).then((res:Response) => res.json());
    }
    function deferred<T>(success?:((value: T) => void | PromiseLike<void>) | null ,fails?:((reason: any) => void | PromiseLike<void>) | null ,final?:(() => void) | null){
        let d: Deferred<T> = new Deferred<T>();
        d.promise.then(success).catch(fails).finally(final)
        return d
    }
    let dLogin = deferred(console.log)
    // @ts-ignore
    store.dispatch(actions.fetchLogin(dLogin));
    dLogin.resolve(login())


    dLogin.promise.then( () =>{
        let dCode = deferred(console.log)
        // @ts-ignore
        // store.dispatch(actions.fetchLogin(dLogin));
        dCode.resolve(233)
        return dCode.promise
    }).then( (dVerCode) => {

        let dCode = deferred(console.log)
        // @ts-ignore
        // store.dispatch(actions.fetchLogin(dLogin));
        dCode.resolve(456)
        return dCode.promise
    })


  });
});