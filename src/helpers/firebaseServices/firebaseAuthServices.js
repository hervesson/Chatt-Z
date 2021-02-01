import { auth } from "../firebase";


class firebaseAuthServices {
    constructor() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                localStorage.setItem("authUser", JSON.stringify(user));
            } else {
                localStorage.removeItem('authUser');
            }
        });
    }

    /**
     * Registers the user with given details
     */
    registerUser = (email, password, username) => {
        return new Promise((resolve, reject) => {
            auth.createUserWithEmailAndPassword(email, password).then((user) => {
                const prov = auth.currentUser
                prov.updateProfile({
                    displayName: username
                }).then(function() {
                    resolve(auth.currentUser);
                })  
            }, (error) => {
                reject(this._handleError(error));
            });
        });
    }


    updateName = (name) => {
        return new Promise((resolve, reject) => {
            const prov = auth.currentUser
            prov.updateProfile({
                displayName: name
            }).then(function() {
                resolve(auth.currentUser);
            }).catch(function(error) {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * Login user with given details
     */
    loginUser = (email, password) => {
        return new Promise((resolve, reject) => {
            auth.signInWithEmailAndPassword(email, password).then((user) => {
                resolve(auth.currentUser);
            }, (error) => {
                reject(this._handleError(error));
            });
        });
    }

    /**
     * forget Password user with given details
     */
    forgetPassword = (email) => {
        return new Promise((resolve, reject) => {
            auth.sendPasswordResetEmail(email, { url: window.location.protocol + "//" + window.location.host + "/login" }).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(this._handleError(error));
            })
        });
    }

    /**
     * Logout the user
     */
    logout = () => {
        return new Promise((resolve, reject) => {
            auth.signOut().then(() => {
                resolve(true);
            }).catch((error) => {
                reject(this._handleError(error));
            })
        });
    }

    setLoggeedInUser = (user) => {
        localStorage.setItem("authUser", JSON.stringify(user));
    }

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!localStorage.getItem('authUser'))
            return null;
        return JSON.parse(localStorage.getItem('authUser'));
    }

    /**
     * Handle the error
     * @param {*} error 
     */
    _handleError(error) {
        // var errorCode = error.code;
        var errorMessage = error.message;
        return errorMessage;
    }
}


export { firebaseAuthServices };