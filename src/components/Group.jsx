import {getDoc, doc, serverTimestamp, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { useState , useContext} from "react";
import {v4 as uuid} from  "uuid";
import { UserContext } from "../context/userContext";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import '../cssFiles/groupSetting.css';

const Group = ()=>{
    const {currentUser}= useContext(UserContext);
    const navigate = useNavigate();
    const handleSubmit = async(e)=>{
        
        e.preventDefault();
        const displayName = e.target[0].value;
        const file = e.target[1].files[0];
        const Id = uuid();

        const storage = getStorage();
        const date = new Date().getTime();
        const storageRef = ref(storage, `userprofile/${displayName + date}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        try {
            
            uploadTask.on('state_changed',
                (snapshot) => {
                    
                },
                (error) => {
                   
                    console.error('Upload failed:', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await setDoc(doc(db, "groupChat", currentUser.uid), {
                            groupChats: {
                                [Id]: {
                                    groupId: Id,
                                    displayName,
                                    createdAt: serverTimestamp(),
                                    photoURL:downloadURL,
                                },
                                // Keep the existing group chats if any
                                ...(await (await getDoc(doc(db, "groupChat", currentUser.uid))).data()?.groupChats || {}),
                            },
                        });
                        await setDoc(doc(db,"chatRoom",Id),{
                            messages:[]
                        })
            
                        await setDoc(doc(db, "chatCollection", Id), {
                            groupId: Id,
                            displayName,
                            createdAt: serverTimestamp(),
                            photoURL:downloadURL,
                        });
                        console.log("Group created");

                    });
                }
            );

        } catch (err) {
            console.log(err);
        }

        navigate("/");
    }
    

    const handleChatRoom=async(e)=>{
        e.preventDefault();
        const chatCode = e.target[0].value;

        const getChatRoom =  await getDoc(doc(db, "chatCollection", chatCode));

        if(getChatRoom.exists()){
            const room = getChatRoom.data();

            const check =  await getDoc(doc(db, "groupChat",  currentUser.uid));
            if(!check.exists()){
                await setDoc(doc(db, "groupChat", currentUser.uid), {
                    groupChats:{}
                });

            }

            const userDocRef = doc(db, "groupChat", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userDocData = userDocSnap.exists() ? userDocSnap.data() : {};
            const updatedGroupChats = {
                ...userDocData.groupChats,
                [room.groupId]: room,
            };
            await setDoc(userDocRef, {
                ...userDocData,  
                groupChats: updatedGroupChats 
            }, { merge: true });
        }
        navigate("/");
    }

    return(
        <div>
            <div className="setting-inputs">
                <h3>Create new Chat Room:</h3>
                <form onSubmit={handleSubmit}>
                    Display name: <input type="text" placeholder="Name" />
                    ChatRoom photo: <input type="file"/>
                    <button className="click-button">Ok</button>
                </form>

                <h3 style={{marginTop:'5rem'}}>Join a Chat Room</h3>

                <form onSubmit={handleChatRoom}>
                    Enter Chat Room code: <input type="text" placeholder="Enter ChatRoom" />
                    <button className="click-button">Ok</button>
                </form>
            </div>
            <button style={{marginTop:'3rem'}} className="click-button" onClick={()=>navigate("/")}>Go Back</button>

        </div>
    )
}
export default Group;