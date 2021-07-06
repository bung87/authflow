
import { call, fork, put, takeLatest } from 'redux-saga/effects';
// import { postLoginAuth, postLoginCode, postLoginPhone, postLogin } from '../../servers/login';
// import {putUpdatePassword} from '../../servers/person';

function* postLoginByPhone(action) {
    try {
        const { jsonResult } = yield call(postLoginPhone, action.phoneNumber)
        if (jsonResult.code === "200") {
            yield put({
                type: 'SET/STEP',
                step: 2
            });
        }else{
            message.error(jsonResult.msg)
        }
    }catch (error) {
        console.error("postLoginByPhone err",error);
        // message.error(error.toString());
    }
}

function* postLoginByCode(action) {
    try {
        const { jsonResult } = yield call(postLoginCode, action.phoneNumber, action.smsCode);
        if (jsonResult.code === "200") {
            cookie.set('phoneNumber', jsonResult.data.phoneNumber);
            cookie.set('tenants',jsonResult.data.tenants);
            cookie.set('cookieId',jsonResult.data.cookieId);
            if(jsonResult.data.tenants.length===1){
                cookie.set('tenantId',jsonResult.data.tenants[0].tenantId);
                cookie.set('tenantName',jsonResult.data.tenants[0].tenantName);
                yield put({
                    type: 'LOGIN/POST/AUTH',
                    phoneNumber: action.phoneNumber
                });
            }else{
                yield put({
                    type: 'SET/TENANTMODAL',
                    tenantModal: true
                });
            }
        }else{
            message.error(jsonResult.msg)
        }
    }catch (error) {
        console.error("postLoginByCode err",error);
        // message.error(error);
    }
}

function* postLoginByPassword(action) {
    try {
        const { jsonResult } = yield call(postLogin, action.phoneNumber, action.password);
       
        if (jsonResult.code === "200") {
            cookie.set('phoneNumber', jsonResult.data.phoneNumber);
            cookie.set('tenants',jsonResult.data.tenants);
            cookie.set('cookieId',jsonResult.data.cookieId);
            if(jsonResult.data.tenants.length===1){
                cookie.set('tenantId',jsonResult.data.tenants[0].tenantId);
                cookie.set('tenantName',jsonResult.data.tenants[0].tenantName);
                yield put({
                    type: 'LOGIN/POST/AUTH',
                    phoneNumber: action.phoneNumber
                });
            }else{
                yield put({
                    type: 'SET/TENANTMODAL',
                    tenantModal: true
                });
            }
        }else{
            message.error(jsonResult.msg)
        }
    }catch (error) {
        console.error("postLoginByCode err",error);
        // message.error(error);
    }
}

function* postLoginGetAuth(action) {
    try {
        const { jsonResult } = yield call(postLoginAuth, action.phoneNumber);
        if (jsonResult.code === "200") {
            let group = []
            let groupdata = {}
            if(jsonResult.data && jsonResult.data.groups && jsonResult.data.groups.length){
                group = (jsonResult.data.groups).filter(el=>el.groupType == 'MAINTAIN') || []
                if(group&&group.length){
                    groupdata = group[0]
                }else{
                    groupdata = jsonResult.data.groups[0]
                }            }
            cookie.set('groups', jsonResult.data.groups);
            cookie.set('group', groupdata);
            cookie.set('personnel',jsonResult.data.personnel);
            cookie.set('roles',jsonResult.data.roles);
            localStorage.setItem("permissionCodes", jsonResult.data.permissionCodes);
            // window.location.href = '/';
            yield put({
                type: 'SIDEBAR/GET/LIST',
                info: true
            });
        }else{
            message.error(jsonResult.msg)
        }
    }catch (error) {
        console.error("postLoginGetAuth err",error);
        // message.error(error);
    }
}
function* putUpdatePWD(action) {
    try {
        const { jsonResult } = yield call(putUpdatePassword, action.passwordData);
        if (jsonResult.code === "200") {
            message.success('修改密码成功！')
        }else{
            message.error(jsonResult.msg)
        }
    }catch (error) {
        console.error("putUpdatePWD err",error);
        // message.error(error);
    }
}

//事件监听

function* watchLoginByPhone() {
    yield takeLatest('LOGIN/POST/PHONE', postLoginByPhone)
}
function* watchLoginByCode() {
    yield takeLatest('LOGIN/POST/CODE', postLoginByCode)
    yield takeLatest('LOGIN/POST/PASSWORD', postLoginByPassword)
}
function* watchLoginGetAuth() {
    yield takeLatest('LOGIN/POST/AUTH', postLoginGetAuth)
    yield takeLatest('LOGIN/PUT/UPDATEPASSWORD', putUpdatePWD)
}

//启动配置
export default function* () {
    yield fork(watchLoginByPhone);
    yield fork(watchLoginByCode);
    yield fork(watchLoginGetAuth);
}
