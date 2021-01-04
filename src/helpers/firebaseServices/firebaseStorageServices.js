import {  storage  } from "../firebase";


class firebaseStorageServices {
    
    mandarImagem = ( chatMessages, message, numero ) => {
        return new Promise((resolve, reject) => {
            const uploadTask = storage.ref("ZuttChat/images/"+ numero + "/" + message.name).put(message);
            uploadTask.on(
            "state_changed", snapshot => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log(progress)
                }, error => { console.log(error); reject({error})},
                () => {
                    storage.ref("ZuttChat/images/"+ numero + "/" + message.name).getDownloadURL().then(url => {
                        resolve({url})
                    });
                }
            );
        }); 
    } 

    mandarAudio = ( chatMessages, message, numero ) => {
        return new Promise((resolve, reject) => {
            const uploadTask = storage.ref("ZuttChat/audios/"+ numero + "/" + chatMessages.length).put(message);
            uploadTask.on(
            "state_changed", snapshot => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log(progress)
                }, error => { console.log(error); reject({error})},
                () => {
                    storage.ref("ZuttChat/audios/"+ numero + "/" + chatMessages.length).getDownloadURL().then(url => {
                        resolve({url})
                    });
                }, 
            );
        }); 
    }

    mandarArquivo = ( chatMessages, messageObj, message, numero ) => {
        return new Promise((resolve, reject) => {
            const uploadTask = storage.ref("ZuttChat/files/"+ numero + "/" + chatMessages.length).put(message);
            uploadTask.on(
            "state_changed", snapshot => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log(progress)
                }, error => { console.log(error); reject({error})},
                () => {
                    storage.ref("ZuttChat/files/"+ numero + "/" + chatMessages.length).getDownloadURL().then(url => {
                        resolve({url})
                    });
                }, 
            );
        }); 
    }
}


export { firebaseStorageServices };