import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { getFirebaseBackend } from "../../helpers/firebase";


import {
    REQUEST_CHAT,
} from './constants';


import {
    requestSucess,
    requestFailed,
} from './actions';


//Initilize firebase
const fireBaseBackend = getFirebaseBackend();


function* retriveData() {
    try {
        const response = yield call(fireBaseBackend.retriveData);
        yield put(requestSucess(response));
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}


export function* watchChats() {
    yield takeEvery(REQUEST_CHAT, retriveData);
}


function* chatSaga() {
    yield all([
        fork(watchChats),
    ]);
}

export default chatSaga;