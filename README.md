# authflow

authflow provide three steps login defined in `AuthFlowActions`

1. loginRequest: auth info post
2. codeRequest: verification code (eg. sms code handle)
3. statusRequest: refresh authed user info

### Prepare

```ts
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunk))
```

### Useage

```ts
import { deferred, fetchLogin, fetchCode, fetchStatus, AuthFlowActions } from '@bung87/authflow'

function login() {
  return fetch('http://example.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then((res: any) => res.json())
}

let dLogin = deferred(console.log)
store.dispatch(fetchLogin(dLogin))
dLogin.resolve(login())
```
