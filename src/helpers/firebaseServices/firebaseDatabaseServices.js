import {  database, storage  } from "../firebase";

import zutt from "../../assets/images/users/zutt.png";

class firebaseDatabaseServices {
    mandarMensagem = (newMessage, numero) => {
        try{
            database
              .ref("/server/talks/" + numero + "/messages")
              .set(newMessage)
        }catch(error){
            console.log(error)
        }   
    }

    mandarImagem = ( chatMessages, messageObj, message, numero ) => {
        return new Promise((resolve, reject) => {
        const uploadTask = storage.ref("ZuttChat/images/"+ numero + "/" + message.name).put(message);
        uploadTask.on(
            "state_changed",
            snapshot => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log(progress)
            },
            error => { console.log(error); reject({error})},
            () => {
               storage.ref("ZuttChat/images/"+ numero + "/" + message.name).getDownloadURL().then(url => {

                resolve({url})
                
                var imageMessage = [
                    { image : url},
                ]

                var Xmas95 = new Date(); 
                var horas  = Xmas95.getHours();
                var minut = Xmas95.getMinutes();
                var date = Xmas95.getDate();
                var month  = Xmas95.getMonth() + 1;
                var data =  date+"/"+month

                var  messageImg = {
                    id : chatMessages.length,
                    imageMessage : imageMessage,
                    size : message.size,
                    time : horas+":"+minut,
                    data: data,
                    userType : "sender",
                    image : zutt,
                    isImageMessage : true,
                    isFileMessage : false
                }

                let ultima = chatMessages[chatMessages.length-1].data
                if (ultima !== data) {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, {isToday: true, data: data}, messageImg]
                    )
                } else {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, messageImg]
                    )
                }
                });
            }, 
          );
        }); 
    }

    mandarAudio = ( chatMessages, messageObj, message, numero ) => {
        return new Promise((resolve, reject) => {
        const uploadTask = storage.ref("ZuttChat/audios/"+ numero + "/" + chatMessages.length).put(message);
        uploadTask.on(
            "state_changed",
            snapshot => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log(progress)
            },
            error => { console.log(error); reject({error})},
            () => {
                storage.ref("ZuttChat/audios/"+ numero + "/" + chatMessages.length).getDownloadURL().then(url => {

                resolve({url})

                var Xmas95 = new Date(); 
                var horas  = Xmas95.getHours();
                var minut = Xmas95.getMinutes();
                var date = Xmas95.getDate();
                var month  = Xmas95.getMonth() + 1;
                var data =  date+"/"+month

                var  messageAud = {
                    id : chatMessages.length,
                    audioMessage : url,
                    size : message.size,
                    time : horas+":"+minut,
                    data: data,
                    userType : "sender",
                    image : zutt,
                    isImageMessage : true,
                    isFileMessage : false,
                    isAudioMessage: true
                }

                let ultima = chatMessages[chatMessages.length-1].data
                if (ultima !== data) {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, {isToday: true, data: data}, messageAud]
                    )
                } else {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, messageAud]
                    )
                }
                });
            }, 
          );
        }); 
    }

    mandarArquivo = ( chatMessages, messageObj, message, numero ) => {
        return new Promise((resolve, reject) => {
        const uploadTask = storage.ref("ZuttChat/files/"+ numero + "/" + chatMessages.length).put(message);
        uploadTask.on(
            "state_changed",
            snapshot => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log(progress)
            },
            error => { console.log(error); reject({error})},
            () => {
               storage.ref("ZuttChat/files/"+ numero + "/" + chatMessages.length).getDownloadURL().then(url => {

                resolve({url})

                var Xmas95 = new Date(); 
                var horas  = Xmas95.getHours();
                var minut = Xmas95.getMinutes();
                var date = Xmas95.getDate();
                var month  = Xmas95.getMonth() + 1;
                var data =  date+"/"+month

                var messageFile = {
                    id : chatMessages.length,
                    downloadURL: url,
                    fileMessage : message.name,
                    size : message.size,
                    time : horas+":"+minut,
                    data: data,
                    userType : "sender", 
                    image : zutt,
                    isFileMessage : true,
                    isImageMessage : false,
                    isAudioMessage : false
                }

                let ultima = chatMessages[chatMessages.length-1].data
                if (ultima !== data) {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, {isToday: true, data: data}, messageFile]
                    )
                } else {
                    database.ref("/server/talks/"+ numero + "/messages").set(
                        [...chatMessages, messageFile]
                    )
                }
                });
            }, 
          );
        }); 
    }
}


export { firebaseDatabaseServices };