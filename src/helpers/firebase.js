import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"
import "firebase/storage"


var firebaseConfig = {
    apiKey: "AIzaSyChb2hvMemZhF87I14boqorozGPQp1t0Mc",
    authDomain: "chat-foguetedev.firebaseapp.com",
    databaseURL: "https://chat-foguetedev-default-rtdb.firebaseio.com",
    projectId: "chat-foguetedev",
    storageBucket: "chat-foguetedev.appspot.com",
    messagingSenderId: "924848833067",
    appId: "1:924848833067:web:fbd9699b4b7b77c2fb606e",
    measurementId: "G-PTEC3W947V"
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

