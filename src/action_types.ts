export default class AuthFlowActions {
  static loginRequest = 'auth_login_request'
  static loginRequestSuccess = 'auth_login_request_success'
  static loginRequestFailure = 'auth_login_request_fails'
  static loginRequestFinal = 'auth_login_request_final'
  static codeRequest = 'auth_code_request'
  static codeRequestFinal = 'auth_code_request_final'
  static codeRequestSuccess = 'auth_code_request_success'
  static codeRequestFailure = 'auth_code_request_failure'
  static statusRequest = 'auth_status_request'
  static statusRequestFinal = 'auth_status_request_final'
  static statusRequestSuccess = 'auth_status_request_success'
  static statusRequestFailure = 'auth_status_request_failure'
}
