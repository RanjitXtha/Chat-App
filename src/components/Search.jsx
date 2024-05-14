import { db } from "../firebase";
import { serverTimestamp,  updateDoc , doc } from "firebase/firestore";
import { query , collection , where , getDoc,setDoc , getDocs } from "firebase/firestore";
import { useState , useContext } from "react";
import { UserContext } from "../context/userContext";


const Search =()=>{
    const [searchName , setSearchName]=useState("");
    const [user , setUser]=useState(null);

    const {currentUser} = useContext(UserContext);

    const handleSearch =async ()=>{
        const q = query(collection(db,"users"),where("displayName","==",searchName));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        setUser(doc.data());
        
        });
    }

    const handleKey=e=>{
        if(e.code === "Enter"){handleSearch();}
    }

    const startChat=async()=>{
        console.log("clicked");
        const combinedId = currentUser.uid > user.uid
        ? currentUser.uid + user.uid 
        : user.uid+currentUser.uid;
        try{
            const res = await getDoc(doc(db,"chats",combinedId));
            if(!res.exists()){
                await setDoc(doc(db,"chats",combinedId),{messages:[]})

                await updateDoc(doc(db,"userChats",currentUser.uid),{
                    [combinedId+".userInfo"]:{
                        uid:user.uid,
                        displayName:user.displayName,
                        photoURL:user.photoURL
                    },
                    [combinedId+".date"]:serverTimestamp()
                })

                await updateDoc(doc(db,"userChats",user.uid),{
                    [combinedId+".userInfo"]:{
                        uid:currentUser.uid,
                        displayName:currentUser.displayName,
                        photoURL:currentUser.photoURL
                    },
                    [combinedId+".date"]:serverTimestamp()
                })

                

            }
        }catch(err){
            console.log(err);
        }

        setUser(null);
        setSearchName("");
        
        
    }


    return(
        <div>
            <input type="text" placeholder="search users" 
            onChange={e=>setSearchName(e.target.value)}
            className="search-bar"
            onKeyDown={handleKey}
            />
            {
                user?
                <div onClick={startChat} style={{marginTop:'2rem',display:'flex',alignItems:'center',columnGap:'1rem'}}>
                    <img className="profile-pic" src={user.photoURL} />
                    <p>{user.displayName}</p>
                </div>:null
            }
        </div>
    )
}

export default Search;