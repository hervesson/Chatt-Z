import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

import { firebaseDatabaseServices } from "../../helpers/firebaseServices/firebaseDatabaseServices";

import { database } from "../../helpers/firebase";

import { eventChannel } from "redux-saga";

import { apiServices } from "../../helpers/apiServices";

import {
    REQUEST_CHAT,
    REQUEST_CONTACTS,
    FULL_USER,
    SET_IMAGE,
    SET_AUDIO,
    SET_FILE,
} from './constants';


import {
    requestSucess,
    requestFailed,
    contactsSucess
} from './actions';


//Initilize firebase
const fireBaseBackend = new firebaseDatabaseServices();
const apiBackend = new apiServices();


function* retriveData() {
    const channel = new eventChannel(emiter => {
    const listener = database.ref("/server/talks").on("value", snapshot => {
        let conversas = [];
        snapshot.forEach(ids => {
            conversas.push(ids.val()); 
        })
      emiter({ data: conversas || {} });
    });

    return () => {
        listener.off();
        };
    });

    while (true) {
    const { data } = yield take(channel);
        // #4
    yield put(requestSucess(data));
  }
}


function* retriveContacts() {
    try {
        const response = yield call(apiBackend.retriveContatos);
        yield put(contactsSucess(response));
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}

function* sender({ payload: {messageObj, newMessage, reference } }) {
    try {
       const response = yield call(apiBackend.sendMessages, messageObj, reference);
       if (response === true) {
            yield call(fireBaseBackend.mandarMensagem, messageObj, newMessage, reference);
       } else {
        console.log("Errou ao mandar mensagem para API")
       }
    } catch (error) {
        console.log(error)
        yield put(requestFailed(error)); 
    }
}

function* sendImage({ payload: { chatMessages, messageObj, message, numero }  }) {
    try {
        const response = yield call(fireBaseBackend.mandarImagem, chatMessages, messageObj, message, numero);
        const imageSend = yield call(apiBackend.sendImagem, response, numero);
        
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}

function* sendAudio({ payload: { chatMessages, messageObj, message, numero }  }) {
    try {
        const response = yield call(fireBaseBackend.mandarAudio, chatMessages, messageObj, message, numero);
        yield call(apiBackend.sendAudio, response, numero);
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}

function* sendFile({ payload: { chatMessages, messageObj, message, numero }  }) {
    try {
        const response = yield call(fireBaseBackend.mandarArquivo, chatMessages, messageObj, message, numero);
         yield call(apiBackend.sendDocument, response, numero);
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}


export function* watchChats() {
    yield takeEvery(REQUEST_CHAT, retriveData);
}

export function* watchContacts() {
    yield takeEvery(REQUEST_CONTACTS, retriveContacts);
}

export function* senderMessage() {
    yield takeEvery(FULL_USER, sender);
}

export function* senderImage() {
    yield takeEvery(SET_IMAGE, sendImage);
}

export function* senderAudio() {
    yield takeEvery(SET_AUDIO, sendAudio);
}

export function* senderFile() {
    yield takeEvery(SET_FILE, sendFile);
}




function* chatSaga() {
    yield all([
        fork(watchChats),
        fork(watchContacts),
        fork(senderMessage),
        fork(senderImage),
        fork(senderAudio),
        fork(senderFile), 
    ]);
}

export default chatSaga;



/*function* retriveData() {
    try {
        const response = yield call(fireBaseBackend.retriveData);
        yield put(requestSucess(response));
    } catch (error) {
        yield put(requestFailed(error)); 
    }
}*/