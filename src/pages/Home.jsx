import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Search from "../components/Search";
import ChatList from "../components/Chat";
import {Messages , Input} from "../components/Messages";
import '../cssFiles/Home.css';
import { FriendsContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";
import GroupChats from "./GroupChat";
import { CGToggleContext } from "../context/chatGroupToggle";
import { GroupContext } from "../context/groupContext";

const Home=()=>{
    const navigate = useNavigate();
    const {CGState} = useContext(CGToggleContext);
    const {currentUser} = useContext(UserContext);
    const {state} = useContext(FriendsContext) ;
    const {groupData} = useContext(GroupContext);


    const renderProfile = () => {
        if (CGState.currentState === "chat") {
          return (
            <div style={{display:'flex',alignItems:'center',columnGap:'1rem'}}>
                <img src={state.user.photoURL} className="profile-pic" />
                <p>{state.user.displayName}</p>
            </div>
          );
        } else if (CGState.currentState === "group") {
          return (
            <div style={{display:'flex',alignItems:'center',columnGap:'1rem'}}>
            <img src={groupData.photoURL} className="profile-pic" />
            <p>{groupData.displayName}</p>
        </div>
          );
        } else {
          return <div></div>;
        }
      };

    return(
            <div className="body">
                <div className="sidebar">
                    <span>
                        <h1>CA</h1>
                    </span>

                    <div style={{marginTop:'3rem'}}>
                        <GroupChats />
                    </div>
                </div>
                
                <div >
                    <header>
                        <div className="profile-bar">
                            
                            {
                                renderProfile()
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
                                CGState.currentState!=='null'?
                                <Input />:null
                            }
                            
                        </div>

                

                    

                </div>

                <div className="sidebar">
                    <h1>ChatApp</h1>
                    <div style={{marginTop:'1rem'}}>
                        <Search />
                        <ChatList />
                    </div>
                    
                </div>
            </div>
    )
}


export default Home;