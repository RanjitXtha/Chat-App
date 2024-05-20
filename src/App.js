import './App.css';
import Register from './pages/register';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/login';
import { UserContext } from './context/userContext';
import GroupSetting from './pages/GroupSetting';
import { useContext } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from './firebase';

function App() {
  const {currentUser} = useContext(UserContext);

 

const db = getDatabase();
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
});


  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route path="Chat-App" element={currentUser?<Home />:<LogIn/>} />
            <Route index element={currentUser?<Home />:<LogIn/>} />
            <Route path="login" element = {<LogIn />}/>
            <Route path="register" element = {<Register />}/>
            <Route path="group-setting" element={<GroupSetting />}/>
          </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
