import { database } from "../firebase";
import moment from 'moment'; 
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

        let ultima = chatMessages[chatMessages.length-1].time
        var lastTime = moment(ultima).format("DD/MM");
        var currentDate = moment(new Date().getTime()).format("DD/MM")

        var imageMessage = [
            { image : response.ImageUrl},
        ]

        var  messageImg = {
            MessageId: response.MessageId,
            imageMessage : imageMessage,
            message: messageObj.message,
            size : message.size,
            time : new Date().getTime(),
            userType : "sender",
            image : zutt,
            status: "send",
            isImageMessage : true,
            isFileMessage : false,
            isAudioMessage: false
        }

        if (lastTime !== currentDate) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageImg]
            )
        } else {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, messageImg]
            )
        }       
    }

    mandarMessaAudio(chatMessages, message, numero, response){

        let ultima = chatMessages[chatMessages.length-1].time
        var lastTime = moment(ultima).format("DD/MM");
        var currentDate = moment(new Date().getTime()).format("DD/MM")

        var  messageAud = {
            MessageId: response.MessageId,
            audioMessage : response.AudioUrl,
            size : message.size,
            time : new Date().getTime(),
            userType : "sender",
            image : zutt,   
            status: "send",
            isImageMessage : false,
            isFileMessage : false,
            isAudioMessage: true
        }

        if (lastTime !== currentDate) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageAud]
            )
        } else {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, messageAud]
            )
        }
    }

    mandarMessaArquivo(chatMessages, message, numero, response){

        let ultima = chatMessages[chatMessages.length-1].time
        var lastTime = moment(ultima).format("DD/MM");
        var currentDate = moment(new Date().getTime()).format("DD/MM")

        var messageFile = {
            MessageId: response.MessageId,
            downloadURL: response.DocumentUrl,
            fileMessage : message.name,
            size : message.size,
            time : new Date().getTime(),
            status: "send",
            userType : "sender", 
            image : zutt,
            isFileMessage : true,
            isImageMessage : false,
            isAudioMessage : false
        }

        if (lastTime !== currentDate) {
            database.ref("/server/talks/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageFile]
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