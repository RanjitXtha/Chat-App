import { onSnapshot } from "firebase/firestore";
import {useEffect, useContext, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../context/userContext";
import { FriendsContext } from "../context/chatContext";
import '../cssFiles/chatList.css';
import { CGToggleContext } from "../context/chatGroupToggle.js";

const ChatList = () => {
    const [Chats, setChats] = useState([]);
    const {currentUser}= useContext(UserContext);
    const { state,dispatch } = useContext(FriendsContext);
    const {groupDispatch} = useContext(CGToggleContext);
  

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                    setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const [chatOrder, setChatOrder] = useState([]);

    useEffect(() => {
        setChatOrder(Object.values(Chats).map(chat => chat.userInfo.uid));
    }, [Chats]);    

    

    const handleSelect = (user) => {
        dispatch({ type: "ADD_USER", payload: user });
        groupDispatch({type:'TOGGLE',payload:'chat'})
        const filteredOrder = chatOrder.filter(chatId => chatId !== user.uid);
        setChatOrder([user.uid, ...filteredOrder]);
    };

  
 
    return (
        <div className="chat-list">
            {Object.entries(Chats).map((chat) => (
                <div className={`friend ${chat[1].userInfo.uid===state.user.uid?'friend-active':null}`} key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)} >
                    <div className="profile-pic"><img src={chat[1].userInfo.photoURL} alt="user-avatar" /></div>
                    <div className="friend-info">
                        <p>{chat[1].userInfo.displayName}</p>
                        {
                            
                            chat[1].lastMessage?
                                <p className="last-message">{chat[1].lastMessage.text}</p>
                            :null
                        }
                        
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ChatList;