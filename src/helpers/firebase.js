import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"
import "firebase/storage"


var firebaseConfig = {
    apiKey: "AIzaSyBjHzDsOKoEvBrPfIY7tueR8_MgbKIeYMQ",
    authDomain: "chat-zutt.firebaseapp.com",
    databaseURL: "https://chat-zutt.firebaseio.com",
    projectId: "chat-zutt",
    storageBucket: "chat-zutt.appspot.com",
    messagingSenderId: "62254642008",
    appId: "1:62254642008:web:e1e767d089ffe45dfbeb2d",
    measurementId: "G-YG1693PDKS"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

