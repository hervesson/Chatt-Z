import React, { useState,useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import moment from 'moment'; 

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput"; 
import FileList from "./FileList";

//actions
import { openUserSidebar, 
    setFullUser, 
    requestChat, 
    setImage, 
    setAudio, 
    setFile, 
    requestContacts
} from "../../../redux/actions";

//Import Images

import zutt from "../../../assets/images/users/zutt.png";

//i18n
import { useTranslation } from 'react-i18next';

function UserChat(props) {

    const ref = useRef();  

    const [modal, setModal] = useState(false);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required

    const [ chatMessages, setchatMessages ] = useState([props.recentChatList[props.active_user].messages]); 

    useEffect(() => {
        setchatMessages(props.recentChatList[props.active_user].messages);
        ref.current.recalculate();
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    },[props.active_user, props.recentChatList]);

    useEffect(() => {
       props.requestChat();
       //props.requestContacts()
    },[]); 

    const toggle = () => setModal(!modal);

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
                    userType : "sender",
                    image : zutt,
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
                    userType : "sender",
                    image : zutt,
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
                    userType : "sender", 
                    image : zutt,
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
                    userType : "sender",
                    image : zutt,
                    isImageMessage : true,
                    isFileMessage : false,
                    isAudioMessage : false
                }
                break;
            default:
                break;
        }
     
        setchatMessages([...chatMessages, messageObj]);

        let copyallUsers = props.recentChatList;
        copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        copyallUsers[props.active_user].isTyping = false;
        let numero = copyallUsers[props.active_user].id

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
                props.setFullUser(messageObj, newMessage, numero);
                break;

            case "audioMessage":
                props.setAudio(chatMessages, messageObj, message, numero);
                break;    

            case "fileMessage":
                props.setFile(chatMessages, messageObj, message, numero);
                break;

            case "imageMessage":
                props.setImage(chatMessages, messageObj, message, numero);
                break;
        
            default:
                break;
        }

        
        scrolltoBottom();
    }

    function scrolltoBottom(){  
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
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
    
    return (
        <React.Fragment>
            <div className="user-chat w-100">
                
                <div className="d-lg-flex">

                    <div className={ props.userSidebar ? "w-70" : "w-100" }>

                        {/* render user head */}
                        <UserHead /> 

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
                                        (props.recentChatList[props.active_user].isGroup === true) ? 
                                            <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                <div className="conversation-list">
                                                    
                                                    <div className="chat-avatar">
                                                    {chat.userType === "sender" ?   <img src={zutt} alt="ZuttChat" /> : 
                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                <div className="chat-user-img align-self-center mr-3">
                                                                            <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {chat.userName && chat.userName.charAt(0)}                                                                                    
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="ZuttChat" />
                                                    }
                                                    </div>
                
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                {
                                                                    chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message}

                                                                        </p>
                                                                }
                                                                {
                                                                    chat.audioMessage &&
                                                                       <audio src={chat.audioMessage} controls="controls"/>
                                                                        
                                                                }
                                                                {
                                                                    chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                }
                                                                {
                                                                    chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
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
                                                                    !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                }
                                                            </div>
                                                            {
                                                                !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id) }>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                            }
                                                            
                                                        </div>
                                                        {
                                                            <div className="conversation-name">{chat.userType === "sender" ? "Patricia Smith" : chat.userName}</div>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        :
                                            <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                <div className="conversation-list">
                                                        {
                                                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? 
                                                            
                                                            <div className="chat-avatar">
                                                                <div className="blank-div"></div>
                                                            </div>
                                                            :  
                                                                <div className="chat-avatar">
                                                                    {chat.userType === "sender" ?   <img src={zutt} alt="ZuttChat" /> : 
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="ZuttChat" />
                                                                    }
                                                                </div>
                                                            :   <div className="chat-avatar">
                                                                    {chat.userType === "sender" ?   <img src={zutt} alt="ZuttChat" /> : 
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                                <div className="chat-user-img align-self-center mr-3">
                                                                                            <div className="avatar-xs">
                                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                                    {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                        :  <img src={props.recentChatList[props.active_user].profilePicture} alt="ZuttChat" />
                                                                    }
                                                                </div>
                                                        }
                                                    
                
                                                    <div className="user-chat-content">
                                                        <div className="ctext-wrap">
                                                            <div className="ctext-wrap-content">
                                                                {
                                                                    chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message}
                                                                        </p>
                                                                }
                                                                {
                                                                    chat.audioMessage &&
                                                                    <div>
                                                                        <p className="mb-0">
                                                                           audio
                                                                        </p>
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
                                                                            <p className="mb-0">
                                                                               file
                                                                            </p>
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
                                                                        {chat.userType === "sender" ? status(chat.status) : null}
                                                                         
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
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id) }>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                            }
                                                            
                                                        </div>
                                                        {
                                                            chatMessages[key+1] ? chatMessages[key].userType === chatMessages[key+1].userType ? null :  <div className="conversation-name">{chat.userType === "sender" ?  "Zutt Salles" : props.recentChatList[props.active_user].name}</div> : <div className="conversation-name">{chat.userType === "sender" ? "Zutt Salles" : props.recentChatList[props.active_user].name}</div>
                                                        }
                                                        {/* {
                                                            <div className="conversation-name">{chat.userType === "sender" ? "Admin" : props.recentChatList[props.active_user].name}</div>
                                                        } */}

                                                    </div>
                                                </div>
                                            </li>
                                    )
                                }
                                 </ul>
                                </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{maxHeight: "200px"}}>
                                        <SelectContact handleCheck={() => {}} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Forward</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody>
                        </Modal>
    
                        <ChatInput onaddMessage={addMessage} />
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user,userSidebar };
};

export default withRouter(connect(mapStateToProps, 
    {openUserSidebar,
    setFullUser, 
    requestChat, 
    setImage, 
    setAudio, 
    setFile, 
    requestContacts})
(UserChat));

