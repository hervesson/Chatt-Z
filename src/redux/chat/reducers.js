import {
    CHAT_USER, ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, REQUEST_CHAT, REQUEST_SUCESS, REQUEST_FAILED
} from './constants';

//Import Images
import avatar2 from "../../assets/images/users/avatar-2.jpg";

const INIT_STATE = {
	active_user :0,
    users: [
        { id : 0, name : "Patrick Hendricks", profilePicture : avatar2, status : "online", unRead : 0, roomType : "contact", isGroup: false, 
            messages: [
                { id: 6, message: "hi...Good Morning!", time: "09:05", userType: "sender", isImageMessage : false, isFileMessage : false },                
            ] 
        },
    ],
    groups : [],
    contacts : [],
    loading: false,
    error: null
};

const Chat = (state = INIT_STATE, action) => {
    console.log(action)
    switch (action.type) {
        case REQUEST_CHAT:
            return { ...state, loading: true, error: false};

        case REQUEST_SUCESS:
            return { ...state, loading: false, error: false, users: action.payload.conversas};

        case REQUEST_FAILED:
            return { ...state, loading: false, error: false };
        case CHAT_USER:
            return { ...state };    

        case ACTIVE_USER:
            return { 
            	...state,
                active_user : action.payload };
                
        case FULL_USER:
            return { 
            	...state,
                users : action.payload };

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
            
    default: return { ...state };
    }
}

export default Chat;