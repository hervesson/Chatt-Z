import { database } from "../firebase";

import zutt from "../../assets/images/users/zutt.png";

class firebaseDatabaseServices {
    mandarMensagem = (messageObj, newMessage, numero, response) => {
        try{
            database
              .ref("/server/talks/" + numero + "/messages")
              .update([...newMessage, {...messageObj, MessageId: response.MessageId, status:"send"}])
        }catch(error){
            console.log(error)
        }   
    }

    mandarMessaImage(chatMessages, messageObj, message, numero, response ){
        var imageMessage = [
            { image : response.ImageUrl},
        ]

        var Xmas95 = new Date(); 
        var horas  = Xmas95.getHours();
        var minut = Xmas95.getMinutes();
        var date = Xmas95.getDate();
        var month  = Xmas95.getMonth() + 1;
        var data =  date+"/"+month

        var  messageImg = {
            MessageId: response.MessageId,
            imageMessage : imageMessage,
            message: messageObj.message,
            size : message.size,
            time : horas+":"+minut,
            data: data,
            userType : "sender",
            image : zutt,
            status: "send",
            isImageMessage : true,
            isFileMessage : false,
            isAudioMessage: false
        }

        let ultima = chatMessages[chatMessages.length-1].data
        if (ultima !== data) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: data}, messageImg]
            )
        } else {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, messageImg]
            )
        }       
    }

    mandarMessaAudio(chatMessages, message, numero, response){
        var Xmas95 = new Date(); 
        var horas  = Xmas95.getHours();
        var minut = Xmas95.getMinutes();
        var date = Xmas95.getDate();
        var month  = Xmas95.getMonth() + 1;
        var data =  date+"/"+month

        var  messageAud = {
            MessageId: response.MessageId,
            audioMessage : response.AudioUrl,
            size : message.size,
            time : horas+":"+minut,
            data: data,
            userType : "sender",
            image : zutt,   
            status: "send",
            isImageMessage : false,
            isFileMessage : false,
            isAudioMessage: true
        }

        let ultima = chatMessages[chatMessages.length-1].data
        if (ultima !== data) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: data}, messageAud]
            )
        } else {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, messageAud]
            )
        }
    }

    mandarMessaArquivo(chatMessages, message, numero, response){
        var Xmas95 = new Date(); 
        var horas  = Xmas95.getHours();
        var minut = Xmas95.getMinutes();
        var date = Xmas95.getDate();
        var month  = Xmas95.getMonth() + 1;
        var data =  date+"/"+month

        var messageFile = {
            MessageId: response.MessageId,
            downloadURL: response.DocumentUrl,
            fileMessage : message.name,
            size : message.size,
            time : horas+":"+minut,
            data: data,
            status: "send",
            userType : "sender", 
            image : zutt,
            isFileMessage : true,
            isImageMessage : false,
            isAudioMessage : false
        }

        let ultima = chatMessages[chatMessages.length-1].data
        if (ultima !== data) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: data}, messageFile]
            )
        } else {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, messageFile]
            )
        }    
    }

    apagarNaoLidas(numero){
        if(numero !== 0){
            database.ref("/server/talks/"+ numero + "/unRead").transaction(function(read) {
                return 0;
            })
        }    
    }
}



export { firebaseDatabaseServices };