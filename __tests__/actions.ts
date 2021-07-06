import AuthFlowActions from './action_types'
import { Deferred } from 'ts-deferred'
import { AnyAction } from 'redux'
function fetchLoginRequest() {
  return {
    type: AuthFlowActions.loginRequest,
  }
}

function fetchLoginFinal() {
  return {
    type: AuthFlowActions.loginRequestFinal,
  }
}

function fetchLoginSuccess(playload: any) {
  return {
    type: AuthFlowActions.loginRequestSuccess,
    playload,
  }
}

function fetchLoginFailure(playload: any) {
  return {
    type: AuthFlowActions.loginRequestFailure,
    playload,
  }
}

function fetchCodeRequest() {
  return {
    type: AuthFlowActions.codeRequest,
  }
}

function fetchCodeFinal() {
  return {
    type: AuthFlowActions.codeRequestFinal,
  }
}

function fetchCodeSuccess(playload: any) {
  return {
    type: AuthFlowActions.codeRequestSuccess,
    playload,
  }
}

function fetchCodeFailure(playload: any) {
  return {
    type: AuthFlowActions.codeRequestFailure,
    playload,
  }
}

/**
 *
 * @param def Deferred
 * @returns Thunk function
 */
export function fetchLogin<T>(def: Deferred<T>) {
  return (dispatch: (action: AnyAction) => AnyAction, _: () => any) => {
    dispatch(fetchLoginRequest())
    return def.promise
      .then(des => {
        dispatch(fetchLoginSuccess(des))
        def.resolve(des)
      })
      .catch(ex => {
        dispatch(fetchLoginFailure(ex))
        def.reject(ex)
      })
      .finally(() => {
        dispatch(fetchLoginFinal())
      })
  }
}
