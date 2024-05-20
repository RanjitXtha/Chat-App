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
import GroupChats from "../components/GroupChat";
import { CGToggleContext } from "../context/chatGroupToggle";
import { GroupContext } from "../context/groupContext";

const Home=()=>{
    const navigate = useNavigate();
    const {CGState} = useContext(CGToggleContext);
    const {currentUser} = useContext(UserContext);
    const {state} = useContext(FriendsContext) ;
    const {groupData} = useContext(GroupContext);

    const copyCode=async(Id)=>{
        await navigator.clipboard.writeText(Id);
        alert("Code copied to clipboard");
        
    }


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
                <div className="group-add-button">
                    <button className="add-button" onClick={()=>copyCode(groupData.groupId)} >+</button>
                    <span>Click to copy Room code</span>
                </div>
                
            </div>
          );
        } else {
          return <div></div>;
        }
      };


      

      

    return(
            <div className="body">
                <div className="sidebar">
                    <div style={{marginTop:'3rem'}}>
                        <GroupChats />
                    </div>
                </div>

                <div className="sidebar-right">
                    <h1 style={{padding:'1rem 2rem'}}>ChatApp</h1>
                    <div style={{padding:'0rem 2rem',marginTop:'1rem'}}>
                        <Search />
                    </div>
                    <ChatList />
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
            </div>
    )
}


export default Home;