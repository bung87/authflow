
import AuthFlowActions from './action_types'
import fetch from 'node-fetch';
function fetchLoginRequest() {
    return {
      type: AuthFlowActions.loginRequest
    };
  }
  
  function fetchLoginSuccess(body:any) {
    return {
      type: AuthFlowActions.loginRequestSuccess,
      body
    };
  }
  
  function fetchLoginFailure(ex:any) {
    return {
      type: AuthFlowActions.loginRequestFailure,
      ex
    };
  }
  
export function fetchLogin(data:any) {
return (dispatch:any) => {
    dispatch(fetchLoginRequest());
    return fetch('http://example.com/login',{method:'POST',headers:{
        'Content-Type': 'application/json'
    },body:JSON.stringify(data)})
    // @ts-ignore
    .then((res:Response) => res.json())
    .then(json => dispatch({
        type:AuthFlowActions.loginRequestSuccess,
        playload:json
    }))
    // .catch(ex => dispatch(addLoginFailure(ex)));
};
}