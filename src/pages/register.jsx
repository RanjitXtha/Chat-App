import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { useState } from "react";

const Register = ()=>{
    const navigate = useNavigate();
    const [error , setError] = useState(false);

    const handleSubmit =async(e)=>{
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const newuser = await createUserWithEmailAndPassword(auth, email, password);
    
            const storage = getStorage();
            const date = new Date().getTime();
            const storageRef = ref(storage, `userprofile/${displayName + date}`);
    
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            uploadTask.on('state_changed',
                (snapshot) => {
                    
                },
                (error) => {
                   
                    console.error('Upload failed:', error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(newuser.user,{
                            displayName,
                            photoURL:downloadURL,
                          });

                        await setDoc(doc(db, "users",newuser.user.uid ), {
                            uid:newuser.user.uid,
                            displayName,
                            email,
                            photoURL:downloadURL,
                        });

                        await setDoc(doc(db, "userChats",newuser.user.uid ), {
                              
                        });

                        navigate("/");
                       
                      
                    });
                }
            );
        } catch (error) {
            console.error(error);
            setError(true);
        }

    }



    return(
        <div className="register-page"> 
            <h1>Register page</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="username" />
                    <input type="email" placeholder="email" />
                    <input type="password" placeholder="password" />
                    <input type="file" />
                    <button className="click-button">Sign Up</button>
                </form>
            <Link className="click-button" to="/login">Already have an account?</Link>
            {error?<p style={{color:'white'}}>There was an error during register</p>:null}
        </div>
    )
}

export default Register;