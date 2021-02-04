import React, { Component } from 'react';
import { Input, InputGroupAddon, InputGroup, Media, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as moment from 'moment';
import 'moment/locale/pt-br';
//simplebar
import SimpleBar from "simplebar-react";

import { database } from "../../../helpers/firebase";

//actions
import { setconversationNameInOpenChat, activeUser, deleteRead, clearMessageReply } from "../../../redux/actions"

//components
//import OnlineUsers from "./OnlineUsers";

class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: "Todos",
            searchChat : "",
            recentChatList : this.props.recentChatList
        }
        this.handleChange = this.handleChange.bind(this);
        this.openUserChat = this.openUserChat.bind(this);
    }

    componentDidMount() {
        var li = document.getElementById("conversation" + this.props.active_user);
        if(li){
            li.classList.add("active");
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.filter(this.state.nav)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recentChatList !== nextProps.recentChatList) {
            this.filter(this.state.nav)
        }
    }

    filter(query){
        var filter = []
        if(query === "Todos"){
            this.setState({ recentChatList: this.props.recentChatList})
        }else{
            this.props.recentChatList.forEach(doc => {
                if (doc.atendente === query) {
                    filter.push(doc)
                }
            }) 
            this.setState({ recentChatList: filter})
        }
    }

    handleChange(e)  {
        this.setState({ searchChat : e.target.value });
        var search = e.target.value;
        let conversation = this.state.recentChatList;
        let filteredArray = [];
        
        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if(conversation[i].name.toLowerCase().includes(search) || conversation[i].name.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }

        //set filtered items to state
        this.setState({ recentChatList : filteredArray })

        //if input value is blanck then assign whole recent chatlist to array
        if(search === "")  this.filter(this.state.nav)
    }

    openUserChat(e,chat) {
        e.preventDefault();

        //find index of current chat in array
        //var index = this.props.recentChatList.indexOf(chat);

        // set activeUser 
        this.props.activeUser(chat); 

        var chatList = document.getElementById("chat-list");
        var clickedItem = e.target;
        var currentli = null;

        if(chatList) {
            var li = chatList.getElementsByTagName("li");
            //remove coversation user
            for(var i=0; i<li.length; ++i){
                if(li[i].classList.contains('active')){
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for(var k=0; k<li.length; ++k){
                if(li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                } 
            }
        }

        //activation of clicked coversation user
        if(currentli) {
            currentli.classList.add('active');
        }

        var userChat = document.getElementsByClassName("user-chat");
        if(userChat) {
            userChat[0].classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        var unread = document.getElementById("unRead" + chat.id);
        if(unread) {
            unread.style.display="none";
        }
    }

    atribuir(chat){
        const user = this.props.user.displayName
        if(chat.atendente === "Novo"){
            database.ref("/server/talks/"+ chat.id + "/atendente").transaction(function(read) {
                return user;
            })
        }
    }

    renderTime(time){
        const now = moment().format('L');
        const data = moment(time).format('L');
        var date1 = moment({ day:moment(time).format("DD"), month: moment(time).format("MM"), year:moment(time).format("YYYY") });
        var date2 = moment({ day:moment().format("DD"), month: moment().format("MM"), year:moment().format("YYYY") });

        if(now == data){
            return moment(time).format('HH:mm')
        }else if(date2.diff(date1, 'days') === 1){
            return "Ontem"
        }else if(date2.diff(date1, 'days') < 7){
            return moment(time).locale('pt-br').format('dddd')
        }else if(date2.diff(date1, 'days') > 7 || moment(time).format("YYYY") === moment().format('YYYY')){
            return moment(time).format('DD/MM/YYYY')
        }else if(moment(time).format("YYYY") == "2020"){
            return moment(time).format('DD/MM/YYYY')
        }  
    }
    
    render() {
        var sorted = this.state.recentChatList.sort(function (a, b) {
            if (    new moment( a.messages[(a.messages).length - 1].time ).format() 
                        >
                    new moment( b.messages[(b.messages).length - 1].time ).format()    
            ) { return -1; }
            if (    new moment( a.messages[(a.messages).length - 1].time ).format()
                        < 
                    new moment( b.messages[(b.messages).length - 1].time ).format()  
            ) 
            { return 1; } 
            return 0;
        });
        return (
            <React.Fragment>
                        <div>
                            <div className="px-4 pt-4">
                                <h4 className="mb-4">krbrindes</h4>
                                <div className="search-box chat-search-box">
                                    <InputGroup size="lg" className="mb-3 bg-light rounded-lg">
                                        <InputGroupAddon addonType="prepend">
                                            <Button color="link" className="text-muted pr-1 text-decoration-none" type="button">
                                                <i className="ri-search-line search-icon font-size-18"></i>
                                            </Button>
                                        </InputGroupAddon>
                                        <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Procure aqui suas conversas" />
                                    </InputGroup> 
                                </div>
                                {/* Search Box */}
                            </div> 

                            {/* online users <OnlineUsers />*/}
                            

                            {/* Start chat-message-list  */}
                            <div className="px-2">
                                <h5 className="mb-3 px-3 font-size-16">Conversas</h5>
                                <ul className="nav nav-tabs nav-fill">
                                    <li className="nav-item">
                                        <a className={this.state.nav == "Novo" ? "nav-link active":"nav-link"} onClick={()=> {this.setState({nav: "Novo"}); this.filter("Novo") }}>Novos</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={this.state.nav == "Todos" ? "nav-link active":"nav-link"}  onClick={()=> {this.setState({nav: "Todos"}); this.filter("Todos") }}>Todos</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={this.state.nav == this.props.user.displayName ? "nav-link active":"nav-link"} onClick={()=> { this.setState({nav: this.props.user.displayName}); this.filter(this.props.user.displayName)}}>Meus</a>
                                    </li>
                                </ul>
                                <SimpleBar style={{ height: 440 }} className="chat-message-list">
                                    <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                                        {
                                            this.state.recentChatList.map((chat, key) =>
                                                <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : chat.isTyping ?  "typing" :  key === this.props.active_user ? "active" : ""}>
                                                    <Link to="#" onClick={(e) => {this.openUserChat(e, chat); this.props.deleteRead(chat.id); this.props.clearMessageReply(); this.atribuir()}}>
                                                        <Media>
                                                            {
                                                                chat.profilePicture === "Null" ?
                                                                    <div className={"chat-user-img " + chat.status +" align-self-center mr-3"}>
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {chat.name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            chat.status &&  <span className="user-status"></span>
                                                                        }
                                                                    </div>
                                                                :
                                                                    <div className={"chat-user-img " + chat.status +" align-self-center mr-3"}>
                                                                        <img src={chat.profilePicture} className="rounded-circle avatar-xs" alt="Z-Chat" />
                                                                        {
                                                                            chat.status &&  <span className="user-status"></span>
                                                                        }
                                                                    </div>
                                                            }
                                                            
                                                            <Media body className="overflow-hidden">
                                                                <h5 className="text-truncate font-size-15 mb-1">{chat.name}</h5>
                                                                <p className="chat-user-message text-truncate mb-0">
                                                                    {
                                                                        chat.isTyping ?
                                                                        <>
                                                                            typing<span className="animate-typing">
                                                                            <span className="dot ml-1"></span>
                                                                            <span className="dot ml-1"></span>
                                                                            <span className="dot ml-1"></span>
                                                                        </span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {
                                                                                chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isImageMessage === true) ? <i className="ri-image-fill align-middle mr-1"></i> : null
                                                                            }
                                                                            {
                                                                                chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isAudioMessage === true) ? <i className="ri-file-music-line align-middle mr-1"></i> : null
                                                                            }
                                                                            {
                                                                                chat.messages && (chat.messages.length > 0  && chat.messages[(chat.messages).length - 1].isFileMessage === true) ? <i className="ri-file-text-fill align-middle mr-1"></i> : null
                                                                            }
                                                                            {chat.messages && chat.messages.length > 0 ?  chat.messages[(chat.messages).length - 1].message : null}
                                                                       </>
                                                                    }
                                                                </p>
                                                            </Media>
                                                            <div className="font-size-11">{chat.messages && chat.messages.length > 0 ?  this.renderTime(chat.messages[(chat.messages).length - 1].time) : null}</div>
                                                            {chat.unRead === 0 ?
                                                                <div className="unread-message" >
                                                                    <span style={{fontSize:10}}>{chat.atendente}</span>
                                                                </div>     :
                                                                <div className="unread-message" id={"unRead" + chat.id}>
                                                                    <span style={{fontSize:10, padding:7, color:"red"}}>{chat.atendente}</span>
                                                                    <span className="badge badge-soft-danger badge-pill">{chat.messages && chat.messages.length > 0 ? chat.unRead >= 20 ? chat.unRead + "+" : chat.unRead  : ""}</span>
                                                                </div>
                                                            } 
                                                        </Media>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    </ul>
                                    </SimpleBar>
                                    
                            </div>
                            {/* End chat-message-list */}
                        </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { user } = state.Auth;
    return { active_user, user };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser, deleteRead, clearMessageReply })(Chats);