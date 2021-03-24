import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    API_FAILED, 
    UPDATE_USER, 
    SET_USER
} from './constants';

const INIT_STATE = {
    user: [],
    loading: false
};


const Auth = (state = INIT_STATE, action) => {
    console.log(action)
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };

        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };

        case UPDATE_USER:
            return { ...state, loading: true };

        case SET_USER:
            return { ...state, user: action.payload.user };       

        case LOGOUT_USER:
            return { ...state, user: null };

        case FORGET_PASSWORD:
            return { ...state, loading: true };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, passwordResetStatus: action.payload, loading: false, error: null };

        case API_FAILED:
            return { ...state, loading: false, error: action.payload };

        default: return { ...state };
    }
}

export default Auth;