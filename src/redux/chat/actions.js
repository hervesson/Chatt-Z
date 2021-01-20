import {
    CHAT_USER,ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, REQUEST_CHAT, REQUEST_SUCESS,REQUEST_FAILED,SET_IMAGE, SET_AUDIO,
    SET_FILE, REQUEST_CONTACTS, CONTACTS_SUCESS, DELETE_READ, SETMESSAGEREPLY, CLEARMESSAGEREPLY
} from './constants';


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload : userId
});

export const setFullUser = (messageObj, newMessage, reference) => ({
    type: FULL_USER,
    payload : { messageObj, newMessage, reference } 
});

export const setImage = (chatMessages, messageObj, message, numero ) => ({
    type: SET_IMAGE,
    payload : { chatMessages, messageObj, message, numero }  
});

export const setAudio = (chatMessages, messageObj, message, numero ) => ({
    type: SET_AUDIO,
    payload : { chatMessages, messageObj, message, numero }  
});

export const setFile = (chatMessages, messageObj, message, numero) => ({
    type: SET_FILE,
    payload : { chatMessages, messageObj, message, numero }  
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload : userData
});

export const createGroup = (groupData) => ({
    type : CREATE_GROUP,
    payload : groupData
})

export const requestChat = () => ({
    type: REQUEST_CHAT
});

export const requestSucess = (chats) => ({
    type: REQUEST_SUCESS,
    payload: chats
});

export const requestFailed = (error) => ({
    type: REQUEST_FAILED,
    payload: error
});

export const requestContacts = () => ({
    type: REQUEST_CONTACTS
});

export const contactsSucess = (contatos) => ({
    type: CONTACTS_SUCESS,
    payload : contatos
});

export const deleteRead = (numero) => ({
    type: DELETE_READ,
    payload: numero
});

export const setMessageReply = (reply) => ({
    type: SETMESSAGEREPLY,
});

export const clearMessageReply = () => ({
    type: CLEARMESSAGEREPLY,
});


