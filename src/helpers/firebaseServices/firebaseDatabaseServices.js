import {  database, storage  } from "../firebase";


class firebaseDatabaseServices {
    retriveData() {
        return new Promise((resolve, reject) => {
            database.ref("/server/talks").on('value', snapshot => {
                let conversas = [];
                    snapshot.forEach(ids => {
                        conversas.push(ids.val()); 
                    })
                resolve({ conversas });
            }, (error) => {
                reject(this._handleError(error));
            })
        }); 
    }

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

                let d = new Date();
                var n = d.getSeconds();

                var  messageImg = {
                    id : chatMessages.length,
                    message : 'image',
                    imageMessage : imageMessage,
                    size : message.size,
                    time : "00:" + n,
                    userType : "sender",
                    //image : avatar4,
                    isImageMessage : true,
                    isFileMessage : false
                }

                database.ref("/server/talks/"+ numero + "/messages").set(
                    [...chatMessages, messageImg]
                )
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

                let d = new Date();
                var n = d.getSeconds();

                var  messageAud = {
                    id : chatMessages.length,
                    message : 'audio',
                    audioMessage : url,
                    size : message.size,
                    time : "00:" + n,
                    userType : "sender",
                    //image : avatar4,
                    isImageMessage : true,
                    isFileMessage : false,
                    isAudioMessage: true
                }

                database.ref("/server/talks/"+ numero + "/messages").set(
                    [...chatMessages, messageAud]
                )
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

                let d = new Date();
                var n = d.getSeconds();

                var messageFile = {
                    id : chatMessages.length,
                    message : 'file',
                    downloadURL: url,
                    fileMessage : message.name,
                    size : message.size,
                    time : "00:" + n,
                    userType : "sender", 
                    //image : avatar4,
                    isFileMessage : true,
                    isImageMessage : false,
                    isAudioMessage : false
                }

                database.ref("/server/talks/"+ numero + "/messages").set(
                    [...chatMessages, messageFile]
                )
                });
            }, 
          );
        }); 
    }
}


export { firebaseDatabaseServices };