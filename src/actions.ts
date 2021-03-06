import AuthFlowActions from './action_types'
import { Deferred } from 'ts-deferred'
// import { AnyAction } from 'redux'
type DispatchFunc = (action: any) => any // (action: AnyAction) => AnyAction
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

function fetchStatusRequest() {
  return {
    type: AuthFlowActions.statusRequest,
  }
}

function fetchStatusFinal() {
  return {
    type: AuthFlowActions.statusRequestFinal,
  }
}

function fetchStatusSuccess(playload: any) {
  return {
    type: AuthFlowActions.statusRequestSuccess,
    playload,
  }
}

function fetchStatusFailure(playload: any) {
  return {
    type: AuthFlowActions.statusRequestFailure,
    playload,
  }
}

/**
 *
 * @param def Deferred
 * @returns Thunk function
 */
export function fetchLogin<T>(def: Deferred<T>,otherAction?:any) {
  return (dispatch: DispatchFunc) => {
    dispatch(fetchLoginRequest())
    return def.promise
      .then(des => {
        dispatch(fetchLoginSuccess(des))
        otherAction && dispatch(otherAction)
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

/**
 *
 * @param def Deferred
 * @returns Thunk function
 */
export function fetchCode<T>(def: Deferred<T>,otherAction?:any) {
  return (dispatch: DispatchFunc) => {
    dispatch(fetchCodeRequest())
    return def.promise
      .then(des => {
        dispatch(fetchCodeSuccess(des))
        otherAction && dispatch(otherAction)
        def.resolve(des)
      })
      .catch(ex => {
        dispatch(fetchCodeFailure(ex))
        def.reject(ex)
      })
      .finally(() => {
        dispatch(fetchCodeFinal())
      })
  }
}

/**
 *
 * @param def Deferred
 * @returns Thunk function
 */
export function fetchStatus<T>(def: Deferred<T>,otherAction?:any) {
  return (dispatch: DispatchFunc) => {
    dispatch(fetchStatusRequest())
    return def.promise
      .then(des => {
        dispatch(fetchStatusSuccess(des))
        otherAction && dispatch(otherAction)
        def.resolve(des)
      })
      .catch(ex => {
        dispatch(fetchStatusFailure(ex))
        def.reject(ex)
      })
      .finally(() => {
        dispatch(fetchStatusFinal())
      })
  }
}
