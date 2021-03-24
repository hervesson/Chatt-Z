import {
    CHAT_USER, ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, REQUEST_CHAT, REQUEST_SUCESS, REQUEST_FAILED, SET_IMAGE, SET_AUDIO, SET_FILE, REQUEST_CONTACTS, CONTACTS_SUCESS, DELETE_READ, SETMESSAGEREPLY, CLEARMESSAGEREPLY} from './constants';

const INIT_STATE = {
	active_user : null,
    users: [],
    groups : [],
    contacts : [],
    loading: false,
    error: null,
    messageReply: false
};

const Chat = (state = INIT_STATE, action) => {
    console.log(action)
    switch (action.type) {
        case REQUEST_CHAT:
            return { ...state, loading: true, error: false};

        case REQUEST_SUCESS:
            return { ...state, loading: false, error: false, users: action.payload};

        case REQUEST_FAILED:
            return { ...state, loading: false, error: false };
        case CHAT_USER:
            return { ...state };    

        case ACTIVE_USER:
            return { 
            	...state,
                active_user : action.payload };

        case SET_IMAGE:
            return { ...state };

        case SET_AUDIO:
            return { ...state };

        case SET_FILE:
            return { ...state };          

        case FULL_USER:
            return { 
            	...state,
                //users : action.payload.fullUser
                 };

        case ADD_LOGGED_USER:
            const newUser =  action.payload
            return{
                ...state, users : [
                    ...state.users, newUser
                ]
            };

        case CREATE_GROUP :
            const newGroup =  action.payload
            return {
                ...state, groups : [
                    ...state.groups, newGroup
                ]
            }

        case REQUEST_CONTACTS:
            return { ...state, loading: true };

        case CONTACTS_SUCESS:
            return { ...state, contacts: action.payload, loading: false };

        case DELETE_READ:
            return { ...state };

        case SETMESSAGEREPLY:
            return { ...state, messageReply: true }; 

        case CLEARMESSAGEREPLY:
            return { ...state, messageReply: false };      
                      
            
    default: return { ...state };
    }
}

export default Chat;