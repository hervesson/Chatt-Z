import React, { useState } from 'react';
import { Button, Input, Row, Col, UncontrolledTooltip, ButtonDropdown, DropdownToggle, DropdownMenu, Label, Form, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import MicRecorder from 'mic-recorder-to-mp3';
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import MessageReply from "./MessageReply"

const Mp3Recorder = new MicRecorder({ bitRate: 128 }); 

function ChatInput(props) {
    const [textMessage, settextMessage] = useState("");
    const [textLegenda, settextLegenda] = useState("");
    const [isOpen] = useState(false);
    const [file, setfile] = useState('');
    const [fileImage, setfileImage] = useState("") 
    const [blobURL, setAudio] = useState('')
    const [isRecording, setRecording] = useState(false)
   
    const toggle = () => {setfileImage(""); settextLegenda("")}

    //function for text input value change
    const handleChange = e => {
        settextMessage(e.target.value)
    }

    const handleChangeLegenda = e => {
        settextLegenda(e.target.value)
    }

    //function for add emojis
    const addEmoji = e => {
        let emoji = e.native;
        settextMessage(textMessage+emoji)
    };

    //function for file input change
    const handleFileChange = e => {
        if(e.target.files.length !==0 )
        setfile( e.target.files[0] )
    }

    //function for image input change
    const handleImageChange = e => {
        if(e.target.files.length !==0 )
        setfileImage(e.target.files[0])
    }


    const start = () => {
        Mp3Recorder.start()
            .then(() => {
               setRecording( true );
            }).catch((e) => console.error(e));
        
    };

    const stop = () => {
        Mp3Recorder.stop()
        .getMp3()
        .then(([buffer, blob]) => {
            //const blobURL = URL.createObjectURL(blob);
            setAudio( blob );
            setRecording(false)
        }).catch((e) => console.log(e));
    };

    //function for send data to onaddMessage function(in userChat/index.js component)
    const onaddMessage = (e, textMessage) => {
        e.preventDefault();
        //if text value is not emptry then call onaddMessage function
        if(textMessage !== "") {
            props.onaddMessage(textMessage, "textMessage");
            settextMessage("");
        }

        if(blobURL !== "") {
            props.onaddMessage(blobURL, "audioMessage");
            setAudio("");
        }

        //if file input value is not empty then call onaddMessage function 
        if(file !== "") {
            props.onaddMessage(file, "fileMessage");
            setfile("")
        }

        //if image input value is not empty then call onaddMessage function
        if(fileImage !== "") {
            props.onaddMessage(fileImage, "imageMessage", textLegenda);
            setfileImage("");
            settextLegenda("")

        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onaddMessage(event, textMessage)
        }
    }

    const { className } = props;
   
    function messageIdGenerator() {
        if(fileImage !== ""){
            const queiraBem =  URL.createObjectURL( fileImage )
            return queiraBem
        }else{
            const nega = ""
            return nega
        }
    }

    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-top mb-0">
                            <Form onSubmit={(e) => onaddMessage(e, textMessage)}>
                                {
                                    props.messageReply.length !== 0 ? <div className="d-flex bd-highlight align-items-center">
                                        <div className="pr-2 w-100 bd-highlight">
                                            <MessageReply reply={props.messageReply}/>
                                        </div>
                                        <div className="flex-shrink-1 bd-highlight">    
                                            <i className="ri-close-circle-line" onClick={() => props.onEventPropsClick()}></i>
                                        </div>
                                    </div> : null
                                }
                                <Row noGutters>
                                    <Col>
                                        <div>
                                            <Input type="text" value={textMessage} onKeyDown={handleKeyDown}  onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Digite aqui sua mensagem..." />
                                        </div>
                                    </Col>
                                    <Col xs="auto">
                                        <div className="chat-input-links ml-md-2">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                <ButtonDropdown className="emoji-dropdown" direction="up" isOpen={isOpen} toggle={toggle}>
                                                    <DropdownToggle id="emoji" color="link" className="text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-emotion-happy-line"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-lg-right">
                                                        <Picker onSelect={addEmoji} />
                                                    </DropdownMenu>
                                                    </ButtonDropdown>
                                                    <UncontrolledTooltip target="emoji" placement="top">
                                                        Emoji
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item input-file">
                                                    <Label id="files" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-attachment-line"></i>
                                                    <Input onChange={(e) => handleFileChange(e)} type="file" name="fileInput" size="60" />
                                                    </Label>   
                                                    <UncontrolledTooltip target="files" placement="top">
                                                        Attached File
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item input-file">
                                                    <Label id="images" className="mr-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <i className="ri-image-fill"></i>
                                                    <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file" name="fileInput" size="60" />
                                                    </Label>   
                                                    <UncontrolledTooltip target="images" placement="top">
                                                        Images
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item input-file">
                                                    <Label id="audio" className="mr-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect">
                                                        <button style={{backgroundColor: isRecording ? "red" : "blue"}} onClick={() => {isRecording ? stop() : start() }}>
                                                            <i className={isRecording ? "ri-mic-fill" : "ri-mic-line"}></i>
                                                        </button>  
                                                    </Label>   
                                                    <UncontrolledTooltip target="audio" placement="top">
                                                        audio
                                                    </UncontrolledTooltip>
                                                </li>
                                                <li className="list-inline-item">
                                                    <Button type="submit" color="primary" className="font-size-16 btn-lg chat-send waves-effect waves-light">
                                                        <i className="ri-send-plane-2-fill"></i>
                                                    </Button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <Col>
                                              <Modal isOpen={fileImage ? true : false} toggle={toggle} className={className}>
                                                <ModalHeader toggle={toggle}>Imagem selecionada</ModalHeader>
                                                <ModalBody>
                                                    <img src={messageIdGenerator()} width="350" alt="chat" className="rounded border" />
                                                    <div>
                                                        <Input type="text" value={textLegenda} onChange={handleChangeLegenda} className="form-control form-control-lg bg-light border-light" placeholder="Digite aqui sua legenda..." />
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                                                    <Button color="primary" onClick={(e) => onaddMessage(e, "")}>Enviar</Button>{' '}
                                                </ModalFooter>
                                              </Modal>
                                            </Col>  
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
        </React.Fragment>
    );
}

export default ChatInput;