import './App.css';
import Register from './pages/register';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/login';
import { UserContext } from './context/userContext';
import { useContext } from 'react';

function App() {
  const {currentUser} = useContext(UserContext);

  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route path="Chat-App" element={currentUser?<Home />:<LogIn/>} />
            <Route index element={currentUser?<Home />:<LogIn/>} />
            <Route path="login" element = {<LogIn />}/>
            <Route path="register" element = {<Register />}/>
          </Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
