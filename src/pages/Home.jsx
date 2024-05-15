import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Search from "../components/Search";
import ChatList from "../components/Chat";
import {Messages , Input} from "../components/Messages";
import '../cssFiles/Home.css';
import { FriendsContext } from "../context/chatContext";

const Home=()=>{
    const {currentUser} = useContext(UserContext);
    const {state} = useContext(FriendsContext) ;

    return(
            <div className="body">
                <div className="sidebar">
                    <span>
                        <h1>ChatApp</h1>
                    </span>
                    <div style={{marginTop:'3rem'}}>
                        <Search />
                        <ChatList />
                    </div>
                   
                </div>
                
                <div >
                    <header>
                        <div className="profile-bar">
                            {state.user.displayName
                            ?<div style={{display:'flex',alignItems:'center',columnGap:'1rem'}}>
                                <img src={state.user.photoURL} className="profile-pic" />
                                <p>{state.user.displayName}</p>
                            </div>
                            :<div></div>
                            }
                            
                            <div style={{display:'flex',alignItems:'center',columnGap:'1rem'}} >
                                <img src={currentUser.photoURL} className="profile-pic" />
                                <button className="click-button" onClick={()=>signOut(auth)}>Sign Out</button>
                            </div>
                           
                        </div>
                    </header>
    
                        <div className="chat-body">
                            <Messages />
                            {
                                state.chatId!=='null'?
                                <Input />:null
                            }
                            
                        </div>

                

                    

                </div>
            </div>
    )
}


export default Home;