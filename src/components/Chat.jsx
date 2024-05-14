import { onSnapshot } from "firebase/firestore";
import {useEffect, useContext, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../context/userContext";
import { FriendsContext } from "../context/chatContext";
import '../cssFiles/chatList.css';

const ChatList = () => {
    const [Chats, setChats] = useState([]);
    const {currentUser}= useContext(UserContext);
    const { dispatch } = useContext(FriendsContext);

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


    const handleSelect = (user) => {
        dispatch({ type: "ADD_USER", payload: user });
    };

  
 
    return (
        <div className="chat-list">
            <p className="titles">Chats</p>
            {Object.entries(Chats).map((chat) => (
                <div className="friend" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                    <div className="profile-pic"><img src={chat[1].userInfo.photoURL} alt="user-avatar" /></div>
                    <div>
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