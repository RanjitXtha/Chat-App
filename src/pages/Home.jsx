import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Search from "../components/Search";
import ChatList from "../components/Chat";
import {Messages , Input} from "../components/Messages";
import '../cssFiles/Home.css';

const Home=()=>{
    const {currentUser} = useContext(UserContext);

    return(
        <div>
            <header>
                <h1>ChatApp</h1>
                <div className="profile-bar">
                    <div className="profile-pic"><img src={currentUser.photoURL} /></div>
                    <button onClick={()=>signOut(auth)}>SignOut</button>
                </div>
            </header>


            <div className="body">
                <div className="sidebar">
                    <Search />
                    <ChatList />
                </div>
                
                <div className="chat-body">
                    <Messages />
                    
                    <Input />
                </div>
            </div>
        </div>
    )
}


export default Home;