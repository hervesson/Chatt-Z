import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card, Media, Button, UncontrolledDropdown, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";

import SimpleBar from "simplebar-react";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

import { firebaseStorageServices } from  "../../../helpers/firebaseServices/firebaseStorageServices";

import { auth } from "../../../helpers/firebase";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function Settings(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);
    const [user, setStateUser] = useState([])
    const [usuario, setStateUsuario] = useState(false)
    const [novoUsuario, setNovoUsuario] = useState("");
    const [fileImage, setfileImage] = useState("")

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    const fireBaseStorageBackend = new firebaseStorageServices();

    useEffect(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                setStateUser(user) 
            } 
        });
    },[])

    const toggle1 = () => {setfileImage("")}

    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
    };

    const toggleCollapse4 = () => {
        setIsOpen4(!isOpen4);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen2(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);

    const handleChange = e => {
        setNovoUsuario(e.target.value)
    }

    const handleImageChange = e => {
        if(e.target.files.length !==0 )
        setfileImage(e.target.files[0])
        setIsOpen5(true)
    }

    const saveUsuario = () => {
        var user = auth.currentUser;
        user.updateProfile({
          displayName: novoUsuario ? novoUsuario : user.displayName
        }).then(function() {
          setStateUsuario(false)
        }).catch(function(error) {
          console.log(error)
        });
    }

    function messageIdGenerator() {
        if(fileImage !== ""){
            const queiraBem =  URL.createObjectURL( fileImage )
            return queiraBem
        }else{
            const nega = user.photoURL
            return nega
        }
    }

    return (
        <React.Fragment>
            <div>
                            <div className="px-4 pt-4">
                                <h4 className="mb-0">{t('Settings')}</h4>
                            </div>

                            <div className="text-center border-bottom p-4">
                                <div className="mb-4 profile-user">
                                    <img src={messageIdGenerator()} className="rounded-circle avatar-lg img-thumbnail" alt="chatvia" />
                                    <Button type="button" color="light" className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                       {/* <Label>
                                            <i className="ri-pencil-fill"></i> 
                                            <Input onChange={(e) => handleImageChange(e)} accept="image/*" type="file" className="invisible" />
                                        </Label> */}
                                    </Button>   
                                    
                                </div>

                                <h5 className="font-size-16 mb-1 text-truncate">{user.displayName}</h5>
                                <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline-block mb-1">
                                    <DropdownToggle tag="a" className="text-muted pb-1 d-block" >
                                        {t('Available')} <i className="mdi mdi-chevron-down"></i>
                                    </DropdownToggle>

                                    <DropdownMenu>
                                        <DropdownItem>{t('Available')}</DropdownItem>
                                        <DropdownItem>{t('Busy')}</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            {/* End profile user */}

                            {/* Start User profile description */}
                            <SimpleBar style={{ maxHeight: "100%" }} className="p-4 user-profile-desc">

                                <div id="profile-setting-accordion" className="custom-accordion">
                                    <Card className="shadow-none border mb-2">
                                        <CustomCollapse
                                            title = "Personal Info"
                                            isOpen={isOpen1} 
                                            toggleCollapse={toggleCollapse1}
                                        >

                                                <div className="float-right">
                                                    {/*<Button color="light" size="sm" type="button" onClick={() => usuario ? saveUsuario() : setStateUsuario(true) }>
                                                        {
                                                            usuario ? 
                                                                <div><i className="ri-save-line mr-1 align-middle"></i> {t('Save')}</div>
                                                            :    
                                                                <div><i className="ri-edit-fill mr-1 align-middle"></i> {t('Edit')}</div>
                                                        }
                                                    </Button>*/}
                                                </div>

                                                {   usuario ? 
                                                    <div>
                                                        <Input type="text" value={novoUsuario} style={{width:"auto"}}  onChange={handleChange}  placeholder="Usuario" />
                                                    </div>
                                                    : 
                                                    <div>
                                                        <p className="text-muted mb-1">{t('Name')}</p>
                                                        <h5 className="font-size-14">{user.displayName}</h5>
                                                    </div>
                                                }

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">{t('Email')}</p>
                                                    <h5 className="font-size-14">{user.email}</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">{t('Time')}</p>
                                                    <h5 className="font-size-14">{t('11:40 AM')}</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">{t('Location')}</p>
                                                    <h5 className="font-size-14 mb-0">{t('California, USA')}</h5>
                                                </div>
                                        </CustomCollapse>
                                    </Card>
                                    {/* end profile card */}

                                    <Card className="shadow-none border mb-2">
                                        <CustomCollapse
                                            title = "Privacy"
                                            isOpen={isOpen2}
                                            toggleCollapse={toggleCollapse2}
                                        >

                                                <div className="py-3">
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Profile photo')}</h5>
                                                        </Media>
                                                        <UncontrolledDropdown className="ml-2">
                                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu right>
                                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Media>
                                                </div>
                                                <div className="py-3 border-top">
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Last seen')}</h5>

                                                        </Media>
                                                        <div className="ml-2">
                                                            <div className="custom-control custom-switch">
                                                                <Input type="checkbox" className="custom-control-input" id="privacy-lastseenSwitch" defaultChecked />
                                                                <Label className="custom-control-label" htmlFor="privacy-lastseenSwitch"></Label>
                                                            </div>
                                                        </div>
                                                    </Media>
                                                </div>

                                                <div className="py-3 border-top">
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Status')}</h5>

                                                        </Media>
                                                        <UncontrolledDropdown className="ml-2">
                                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu right>
                                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Media>
                                                </div>

                                                <div className="py-3 border-top">
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Read receipts')}</h5>

                                                        </Media>
                                                        <div className="ml-2">
                                                            <div className="custom-control custom-switch">
                                                                <Input type="checkbox" className="custom-control-input" id="privacy-readreceiptSwitch" defaultChecked />
                                                                <Label className="custom-control-label" htmlFor="privacy-readreceiptSwitch"></Label>
                                                            </div>
                                                        </div>
                                                    </Media>
                                                </div>
                        
                                                <div className="py-3 border-top">
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Groups')}</h5>

                                                        </Media>
                                                        <UncontrolledDropdown className="ml-2">
                                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu right>
                                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Media>
                                                </div>
                                        </CustomCollapse>
                                    </Card>
                                    {/* end Privacy card */}

                                    <Card className="shadow-none border mb-2">
                                        <CustomCollapse
                                            title = "Security"
                                            isOpen={isOpen3}
                                            toggleCollapse={toggleCollapse3}
                                        >

                                                <div>
                                                    <Media className="align-items-center">
                                                        <Media body className="overflow-hidden">
                                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Show security notification')}</h5>

                                                        </Media>
                                                        <div className="ml-2">
                                                            <div className="custom-control custom-switch">
                                                                <Input type="checkbox" className="custom-control-input" id="security-notificationswitch" />
                                                                <Label className="custom-control-label" htmlFor="security-notificationswitch"></Label>
                                                            </div>
                                                        </div>
                                                    </Media>
                                                </div>
                                        </CustomCollapse>
                                    </Card>
                                    {/* end Security card */}

                                    <Card className="shadow-none border mb-2">
                                        <CustomCollapse
                                            title = "Help"
                                            isOpen={isOpen4}
                                            toggleCollapse={toggleCollapse4}
                                        >

                                                <div>
                                                    <div className="py-3">
                                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('FAQs')}</Link></h5>
                                                    </div>
                                                    <div className="py-3 border-top">
                                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Contact')}</Link></h5>
                                                    </div>
                                                    <div className="py-3 border-top">
                                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Terms & Privacy policy')}</Link></h5>
                                                    </div>
                                                </div>
                                        </CustomCollapse>
                                    </Card>
                                    {/* end Help card */}
                                </div>
                                {/* end profile-setting-accordion */}
                            </SimpleBar>
                            {/* End User profile description */}
                            <Modal isOpen={isOpen5 ? true : false} toggle={toggle1}> 
                                <ModalHeader toggle={toggle1}>Imagem selecionada</ModalHeader>
                                <ModalBody>
                                    <img src={messageIdGenerator()} width="350" alt="chat" className="rounded border" />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={toggle1}>Cancelar</Button>
                                    <Button color="primary" onClick={(e) => {fireBaseStorageBackend.imageProfile(fileImage, user.email) ; setIsOpen5(false)}}>Enviar</Button>{' '}
                                </ModalFooter>
                            </Modal>
                        </div>
        </React.Fragment>
    );
}

export default Settings;