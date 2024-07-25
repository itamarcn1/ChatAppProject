import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ChatPage } from './components/ChatPage/ChatPage';
import { Login } from './components/Login/Login';
import { Signup } from './components/Signup/Signup';
import { NotFound } from './components/NotFound/NotFound';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} exact />
        <Route path='/register' element={<Signup />} />
        <Route path='/chats' element={<ChatPage />} />
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
