import React, { useState,useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, Input } from "reactstrap";
import { connect } from "react-redux";
import moment from 'moment'; 

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

import { database, auth } from "../../../helpers/firebase";

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput"; 
import FileList from "./FileList";
import MessageReply from "./MessageReply";

//actions
import { openUserSidebar, 
    setFullUser, 
    requestChat, 
    setImage, 
    setAudio, 
    setFile, 
    requestContacts, 
    setMessageReply, deleteRead,
    updateUser, setUser
} from "../../../redux/actions";

//Import Images

import zutt from "../../../assets/images/users/zutt.png";
import profile from "../../../assets/images/users/profile.png";

//i18n
import { useTranslation } from 'react-i18next';

function UserChat(props) {

    const ref = useRef();  

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [fileImage, setfileImage] = useState("")
    const [textMessage, settextMessage] = useState("");

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required

    const [ chatMessages, setchatMessages ] = useState([]);
    const [ replyMessage, setReplyMessage ] = useState([]);
   
    
    useEffect(() => {
        if(props.active_user !== null){
            const ref = database.ref("/server/conversas/" + props.active_user.id + "/messages")
            const listener = ref.on("value", snapshot => {
                let conversas = [];
                snapshot.forEach(ids => {
                    conversas.push(ids.val()); 
                })
                setchatMessages(conversas); 
            });
            return () => ref.off('value', listener);
        }
    },[props.active_user]);

    useEffect(() => {
       props.requestChat();  props.requestContacts()
    },[]); 

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user.displayName == null) { toggle1() } 
        });
    }, [])

    useEffect(() => {
        auth.onAuthStateChanged(function(user) { if (user) {props.setUser(user)}});
    }, [])

    useEffect(() => {
        if(props.active_user !== null){
            if(chatMessages[chatMessages.length -1].userType === "receiver"){
                props.deleteRead(props.active_user.id)
            }
        }
        ref.current.recalculate();
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }, [chatMessages])

    useEffect(() => {
        if (props.messageReply == false) { setReplyMessage("") } 
    },[props.messageReply])

    const toggle = () => setModal(!modal);
    const toggle1 = () => setModal1(!modal1);

    const addMessage = (message, type, legenda="") => {
        var messageObj = null;

        let ultima = chatMessages[chatMessages.length-1].time
        var lastTime = moment(ultima).format("DD/MM");
        var currentDate = moment(new Date().getTime()).format("DD/MM")

        //matches the message type is text, file or image, and create object according to it
        switch (type) {
            case "textMessage":
                messageObj = {
                    message : message,
                    time : new Date().getTime(),
                    status: false,
                    ReferenceMessageId: replyMessage.length !== 0 ? replyMessage.MessageId : null,
                    userType : props.user.displayName,
                    image : props.user.photoURL,
                    isFileMessage : false,
                    isImageMessage : false,
                    isAudioMessage : false
                }
                break;

            case "audioMessage":
                messageObj = {
                    audioMessage : URL.createObjectURL(message),
                    time : new Date().getTime(),
                    status: false,
                    ReferenceMessageId: replyMessage.length !== 0 ? replyMessage.MessageId : null,
                    userType : props.user.displayName,
                    image : props.user.photoURL,
                    isFileMessage : false,
                    isImageMessage : false,
                    isAudioMessage : true
                }
                break;    

            case "fileMessage":
                messageObj = {
                    downloadURL: '',
                    fileMessage : message.name,
                    size : message.size,
                    time : new Date().getTime(),
                    status: false,
                    ReferenceMessageId: replyMessage.length !== 0 ? replyMessage.MessageId : null,
                    userType : props.user.displayName,
                    image : props.user.photoURL,
                    isFileMessage : true,
                    isImageMessage : false,
                    isAudioMessage : false
                }
                break;

            case "imageMessage":
                var imageMessage = [
                    { image : URL.createObjectURL( message )},
                ]

                messageObj = {
                    imageMessage : imageMessage,
                    message : legenda,
                    time : new Date().getTime(),
                    status: false,
                    ReferenceMessageId: replyMessage.length !== 0 ? replyMessage.MessageId : null,
                    userType : props.user.displayName,
                    image : props.user.photoURL,
                    isImageMessage : true,
                    isFileMessage : false,
                    isAudioMessage : false
                }
                break;
            default:
                break;
        }
     
        setchatMessages([...chatMessages, messageObj]);

        scrolltoBottom();        

        let numero = props.active_user.id
        let obj = {isToday: true, data: currentDate}
       
        let newMessage = []
        if (lastTime !== currentDate) {
            newMessage = [...chatMessages, obj]
        } 
        else {
            newMessage = [...chatMessages]
        }
        
        switch (type) {
            case "textMessage":
                props.setFullUser(messageObj, newMessage, numero); setReplyMessage("")
                break;
            case "audioMessage":
                props.setAudio(chatMessages, messageObj, message, numero); setReplyMessage("")
                break;    
            case "fileMessage":
                props.setFile(chatMessages, messageObj, message, numero); setReplyMessage("")
                break;
            case "imageMessage":
                props.setImage(chatMessages, messageObj, message, numero); setReplyMessage("")
                break;
            default:
                break;
        }
    }

    function scrolltoBottom(){  
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;
        var filtered = conversation.filter(function (item) {
            return item.MessageId !== id;
        });
        setchatMessages(filtered);
    }

    const status = (status) => {
        switch (status) {
            case "RECEIVED":
                return(<i className={ "ri-check-double-fill" }></i>)
            case "READ":
                return(<i className={ "ri-check-double-fill" } style={{color: 'blue'}}></i>)
            case "PLAYED":
                return(<i className={ "ri-check-double-fill" } style={{color: 'blue'}}></i>)
            case "send":
                return(<i className={ "ri-check-line" }></i>)
            default:
                return(<i className={ "ri-time-line align-middle" }></i>) 
        }
    }

    const time = (time) => {
        var esseTime = moment(time).format("HH:mm");
        return(
            <span className="align-middle">{esseTime}</span>
        )
    }

    const reply = (MessageId) => {
        var vaq = []
        chatMessages.forEach(doc => {if(doc.MessageId == MessageId){ vaq.push(doc) }})
        if(vaq.length !==0 ){
            return(
                <MessageReply reply={vaq[0]}/>
            )
        }
    } 

    function messageIdGenerator() {
        const queiraBem =  URL.createObjectURL( fileImage )
        return queiraBem
    }

    const handleImageChange = e => {
        if(e.target.files.length !==0 )
        setfileImage(e.target.files[0])
    }

    const handleChange = e => {
        settextMessage(e.target.value)
    }

    const verificador = () => {
        if (fileImage == ""){  alert("imagem vazia")}
        else if (textMessage == "" ){ alert("sem usuário")}
        else if(fileImage && textMessage !== ""){
            props.updateUser(fileImage);
            var user = auth.currentUser;
            user.updateProfile({ displayName: textMessage}).then(function(){
                toggle1()
            })
        }
    }
    
    return (
        <React.Fragment>
            <div className="user-chat w-100">
                
                <div className="d-lg-flex">

                    <div className={ props.userSidebar ? "w-70" : "w-100" }>

                        {/* render user head */}
                        { props.active_user ? <UserHead /> : null } 

                            <SimpleBar
                                style={{ maxHeight: "100%" }}
                                ref={ref}
                                className="chat-conversation p-3 p-lg-4"
                                id="messages">
                            <ul className="list-unstyled mb-0">
                                {
                                    chatMessages.map((chat, key) => 
                                        chat.isToday && chat.isToday === true ? <li key={"dayTitle" + key}> 
                                            <div className="chat-day-title">
                                                <span className="title">{chat.data}</span>
                                            </div> 
                                        </li> : 
                                            <li key={key} className={chat.userType !== "receiver" ? "right" : ""}>
                                                <div className="conversation-list">
                                                        {
                                                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? 
                                                            
                                                            <div className="chat-avatar">
                                                                <div className="blank-div"></div>
                                                            </div>
                                                            :  
                                                                <div className="chat-avatar">
                                                                    {chat.userType !== "receiver" ?   <img src={chat.image} alt="ZuttChat" /> : 
                                                                        props.active_user.profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.active_user.name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.active_user.profilePicture} alt="ZuttChat" />
                                                                    }
                                                                </div>
                                                            :   <div className="chat-avatar">
                                                                    {chat.userType !== "receiver" ?   <img src={chat.image} alt="ZuttChat" /> : 
                                                                        props.active_user.profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.active_user.name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.active_user.profilePicture} alt="ZuttChat" />
                                                                    }
                                                                </div>
                                                        }
                                                    
                
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                {
                                                                    <div>
                                                                        {chat.ReferenceMessageId ? reply(chat.ReferenceMessageId): null}
                                                                        <p className="mb-0">
                                                                            {chat.message}

                                                                        </p>
                                                                    </div>   
                                                                }
                                                                {
                                                                    chat.audioMessage &&
                                                                    <div>
                                                                        {chat.ReferenceMessageId ? null : 
                                                                            <p className="mb-0">
                                                                                audio
                                                                            </p>
                                                                        }
                                                                        <audio src={chat.audioMessage} controls="controls" style={{backgroundColor: chat.status === "PLAYED" ? "#17202a" : null}} />
                                                                    </div>  
                                                                        
                                                                }
                                                                {
                                                                    chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                }
                                                                {
                                                                    chat.fileMessage &&
                                                                        //file input component
                                                                        <div>
                                                                            {chat.ReferenceMessageId ? null : 
                                                                                <p className="mb-0">
                                                                                    file
                                                                                </p>
                                                                            }
                                                                            <FileList fileName={chat.fileMessage} fileSize={chat.size} filedownlad={chat.downloadURL} />
                                                                        </div>
                                                                }
                                                                {
                                                                    chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                                <span className="dot ml-1"></span>
                                                                            </span>
                                                                        </p>
                                                                }
                                                                {
                                                                    !chat.isTyping && <p className="chat-time mb-0">
                                                                        {chat.userType !== "receiver" ? status(chat.status) : null}   
                                                                        {time(chat.time)}
                                                                    </p>
                                                                }
                                                            </div>
                                                            {
                                                                !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem onClick={() => {setReplyMessage(chat); props.setMessageReply()}}>{t('Answer')} <i className="ri-question-answer-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Encaminhar<i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.MessageId) }>Deletar <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                            }
                                                            
                                                        </div>
                                                        {
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? null :  
                                                            <div className="conversation-name">{chat.userType !== "receiver" ?  chat.userType : props.active_user.name}</div> : 
                                                            <div className="conversation-name">{chat.userType !== "receiver" ?  chat.userType : props.active_user.name}</div>
                                                        }
                                                        {/* {
                                                            <div className="conversation-name">{chat.userType === "sender" ? "Admin" : props.active_user.name}</div>
                                                        } */}

                                                    </div>
                                                </div>
                                            </li>
                                    )
                                }
                                 </ul>
                                </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Encaminhar para...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{maxHeight: "200px"}}>
                                        <SelectContact handleCheck={() => {}} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Encaminhar</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody> 
                        </Modal>
                        <Modal backdrop="static" isOpen={modal1} centered toggle={toggle1}>
                            <ModalHeader>Insira sua foto e nome de usuário</ModalHeader>
                            <ModalBody>
                                <div>
                                    {
                                        fileImage ? 
                                            <img src={messageIdGenerator()} width="300" alt="chat" className="rounded border" />
                                        :
                                            <img src={profile} width="350" alt="chat" className="rounded border" />  
                                    }     
                                    <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file"  />
                                    <Input type="text" value={textMessage} onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Digite Seu nome de usuário" />

                                </div>    
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={(e) => {verificador()}}>Enviar</Button>{' '}
                            </ModalFooter>
                        </Modal>
                        {
                            props.active_user ? <ChatInput onaddMessage={addMessage} messageReply={replyMessage} onEventPropsClick={() => setReplyMessage("")} /> : null
                        }
                        
                    </div>
                    {
                        props.active_user ? <UserProfileSidebar activeUser={props.active_user} /> : null
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user, messageReply, messages } = state.Chat;
    const { userSidebar } = state.Layout;
    const { user } = state.Auth;
    return { active_user, userSidebar, messageReply, messages, user};
};

export default withRouter(connect(mapStateToProps, 
    {openUserSidebar,
    setFullUser, 
    requestChat, 
    setImage, 
    setAudio, 
    setFile, 
    requestContacts,
    setMessageReply, 
    updateUser,
    deleteRead,
    setUser})
(UserChat));

