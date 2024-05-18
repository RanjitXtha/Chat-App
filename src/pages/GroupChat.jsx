import Group from "../components/Group";
import { onSnapshot } from "firebase/firestore";
import {useEffect, useContext, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../context/userContext";
import {GroupContext} from '../context/groupContext.js';
import { CGToggleContext } from "../context/chatGroupToggle.js";
import { useNavigate } from "react-router-dom";

const GroupChats = ()=>{
    const navigate = useNavigate();
    const {currentUser}= useContext(UserContext);
    const [groupList , setGroupList] = useState([]);
    const {groupData ,dispatch} = useContext(GroupContext);
    const {groupDispatch} = useContext(CGToggleContext);


    useEffect(() => {
        try{
        const getChats = async () => {
            const unsub = await onSnapshot(doc(db, "groupChat",currentUser.uid ), (doc) => {
                const data = doc.data().groupChats;
                 setGroupList(Object.entries(data));
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }catch(err){
        console.log(err);
    }
    }, [ currentUser.uid]);


    const handleSelect =(group)=>{
        dispatch({type:'ADD_GROUP',payload:group})
        groupDispatch({type:'TOGGLE',payload:'group'})

    }


    return(
        <div>
            <div>
                {
                   
                    groupList.map(group=>(
                        <div className="group-pic" style={{marginBottom:'1rem'}} key={group[0]} onClick={()=>handleSelect(group[1])}>
                            <img style={group[0]===groupData.groupId?{outline:'2px solid var(--msg'}:null} src={group[1].photoURL}/>
                            <span className="group-pic-info">{group[1].displayName}</span>
                        </div>
                    ))
                }
            </div>
            <button className="add-button" onClick={()=>navigate("/group-setting")}>+</button>

        </div>
    )
}

export default GroupChats;