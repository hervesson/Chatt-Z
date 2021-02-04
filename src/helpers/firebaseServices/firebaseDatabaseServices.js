import { database } from "../firebase";
import moment from 'moment'; 
import zutt from "../../assets/images/users/zutt.png";

class firebaseDatabaseServices {
    mandarMensagem = (messageObj, newMessage, numero, response) => {
        try{
            database
              .ref("/server/conversas/" + numero + "/messages")
              .update([...newMessage, {...messageObj, MessageId: response.MessageId, status:"send"}]);
            database
              .ref("/server/talks/" + numero + "/messages").set([messageObj]);  
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
            userType : messageObj.userType,
            image : messageObj.image,
            status: "send",
            ReferenceMessageId: messageObj.ReferenceMessageId,
            isImageMessage : true,
            isFileMessage : false,
            isAudioMessage: false
        }

        if (lastTime !== currentDate) {
            database.ref("/server/conversas/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageImg]
            );
            database.ref("/server/talks/"+ numero + "/messages").set([messageImg])
        } else {
            database.ref("/server/conversas/"+ numero + "/messages").update([...chatMessages, messageImg]);
            database.ref("/server/talks/"+ numero + "/messages").set([messageImg])
        }       
    }

    mandarMessaAudio(chatMessages, messageObj, message, numero, response){

        let ultima = chatMessages[chatMessages.length-1].time
        var lastTime = moment(ultima).format("DD/MM");
        var currentDate = moment(new Date().getTime()).format("DD/MM")

        var  messageAud = {
            MessageId: response.MessageId,
            audioMessage : response.AudioUrl,
            size : message.size,
            time : new Date().getTime(),
            userType : messageObj.userType,
            image : messageObj.image,   
            status: "send",
            ReferenceMessageId: messageObj.ReferenceMessageId,
            isImageMessage : false,
            isFileMessage : false,
            isAudioMessage: true
        }

        if (lastTime !== currentDate) {
            database.ref("/server/conversas/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageAud]
            );
            database.ref("/server/talks/"+ numero + "/messages").set([messageAud])
        } else {
            database.ref("/server/conversas/"+ numero + "/messages").update([...chatMessages, messageAud]);
            database.ref("/server/talks/"+ numero + "/messages").set([messageAud])
        }
    }

    mandarMessaArquivo(chatMessages, messageObj, message, numero, response){

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
            ReferenceMessageId: messageObj.ReferenceMessageId,
            userType : messageObj.userType,
            image : messageObj.image,
            isFileMessage : true,
            isImageMessage : false,
            isAudioMessage : false
        }

        if (lastTime !== currentDate) {
            database.ref("/server/conversas/"+ numero + "/messages").update(
                [...chatMessages, {isToday: true, data: currentDate}, messageFile]
            );
            database.ref("/server/talks/"+ numero + "/messages").set([messageFile])
        } else {
            database.ref("/server/conversas/"+ numero + "/messages").update([...chatMessages, messageFile]);
            database.ref("/server/talks/"+ numero + "/messages").set([messageFile])
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