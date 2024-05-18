import { FriendsContext } from "../context/chatContext";
import { UserContext } from "../context/userContext";
//import { storage } from "../firebase";
import { useContext } from "react";
import {v4 as uuid} from  "uuid";
import { getDownloadURL, ref, uploadBytesResumable ,getStorage } from "firebase/storage";
import { serverTimestamp, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect , useState , useRef } from "react";
import { onSnapshot,doc,updateDoc ,getDoc} from "firebase/firestore";
import '../cssFiles/messages.css';
import { IoSendSharp } from "react-icons/io5";
import { FaFileImage } from "react-icons/fa6";
import { GroupContext } from "../context/groupContext";
import { CGToggleContext } from "../context/chatGroupToggle.js";


const Messages = ()=>{
    const [messages , setMessages]=useState([]);
    const {state} = useContext(FriendsContext);
    const { groupData} = useContext(GroupContext);
    const {CGState} = useContext(CGToggleContext);

    useEffect(()=>{
      if(CGState.currentState==="chat"){
        const unsub = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
            if(doc.exists()){setMessages(doc.data().messages)}    
        });

        return()=>{
          unsub();
      }
        
      }
    },[state.chatId]); //chatId is comb of id when we click friend from list. when we click other friend , chatid changes.


    useEffect(()=>{
      if(CGState.currentState==="group"){
        const unsub = onSnapshot(doc(db, "chatRoom", groupData.groupId), (doc) => {
            if(doc.exists()){setMessages(doc.data().messages)}
        });

        return()=>{
          unsub();
      }
        
      }
    },[groupData.groupId]);

    return(
        <div className="chat-box"> 
        <div className="chat">
          {
            CGState.currentState==='null'?<p>Click on your friend to start a conversation</p>:null
          }
        {
                messages.map((msg)=>(
                    <Message message={msg} key={msg.id} />
                ))
            }

        </div>
        </div>
       
    )

}


const Message = ({  message }) => {
    const { currentUser } = useContext(UserContext);
    const { state } = useContext(FriendsContext);
  
    const ref = useRef();
  
    useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, []);

    useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const getTimeAgoString = (timestamp) => {
      const now = new Date();
      const messageTime = timestamp.toDate();
      const differenceInSeconds = Math.floor((now - messageTime) / 1000);
  
      if (differenceInSeconds < 60) {
        return "few sec ago";
      } else if (differenceInSeconds < 3600) {
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
      } else if (differenceInSeconds < 86400) {
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
      } else if (differenceInSeconds < 2592000) {
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
      } else {
        const years = Math.floor(differenceInSeconds / 31536000);
        return `${years} ${years === 1 ? "yr" : "yrss"} ago`;
      }
    }
  
    return (
      <div
        ref={ref}
        className={`message ${message.senderId === currentUser.uid?"owner":null}`}
      >
        <div className="message-box">
          { message.text && <p>{message.text}</p>}
          {message.img && <img src={message.img} alt="" />}
        </div>
        
        <div className="message-info">
          <img
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : state.user.photoURL
            }
            alt=""

            className="profile-pic"
          />
          <p>{getTimeAgoString(message.date)}</p>
        </div>

        
      </div>
    );
  };


   const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const { currentUser } = useContext(UserContext);
    const { state } = useContext(FriendsContext);
    const { groupData} = useContext(GroupContext);
    const {CGState} = useContext(CGToggleContext);
    const storage = getStorage();
  
    const handleSend = async () => {
      if (img) {
        const storageRef = ref(storage, uuid());
        
        const uploadTask = uploadBytesResumable(storageRef, img);
  
        uploadTask.on('state_changed',
        (snapshot) => {
            
        },
          (error) => {
            console.log(error);
          },
          () => {

            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

             if(CGState.currentState==="chat"){
              await updateDoc(doc(db, "chats", state.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
             }else if(CGState.currentState==="group"){

                await updateDoc(doc(db, "chatRoom", groupData.groupId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });

             }

            });
            

          }
        );
      } else if(text.trim() !== ''){

        if(CGState.currentState==="chat"){
        await updateDoc(doc(db, "chats", state.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }else if(CGState.currentState==="group"){
        try{

        await updateDoc(doc(db, "chatRoom", groupData.groupId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }catch(err){
        console.log(err);
      }

      }
      }
  
      if(CGState.currentState==="chat"){
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [state.chatId + ".lastMessage"]: {
            text,
          },
          [state.chatId + ".date"]: serverTimestamp(),
        });
    
        await updateDoc(doc(db, "userChats", state.user.uid), {
          [state.chatId + ".lastMessage"]: {
            text,
          },
          [state.chatId + ".date"]: serverTimestamp(),
        });

      }
      
  
      setText("");
      setImg(null);
    };

    const handleEnter=(e)=>{
      e.code === 'Enter' && handleSend();
    }

    return (
      <div className="input-bar">
        <div className="text-bar">
          <input
            type="text"
            placeholder="Type something..."
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={handleEnter}
          />
        </div>
        
        <div className="send-buttons">
          <input
            className="file-bar"
            type="file"
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file">
            <FaFileImage />
          </label>
          <button onClick={handleSend}><IoSendSharp style={{color:'var(--msg)'}} /></button>
        </div>
      </div>
    );
  };


  export  {Messages ,Input };