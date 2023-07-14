import { useState } from "react"
import './styles.css';
import background_image from '../imgs/warrior_background.jpeg';
import logo from '../imgs/small_logo.png'
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function FormsAndButtons() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  function postRegister(){
    axios.post(
      `${import.meta.env.VITE_API_URL}/signup`,
      {username, password, email}
    ).then((response) => {
      navigate('/login')
    })
  }

  return (
  <>
  <div className="forms-container">
    <div><h4 className="text" style={{marginTop: '25px', alignSelf: 'bottom'}} >Email:</h4></div>
    <div style={{marginTop: 'auto'}}>
      <input onChange={(e) => setEmail(e.target.value)} ></input>
    </div>
    <div><h4 className="text">Username:</h4></div>
    <div><input onChange={(e) => setUsername(e.target.value)} ></input></div>
    <div><h4 className="text">Password:</h4></div>
    <div><input type="password" onChange={(e) => setPassword(e.target.value)} ></input></div>
    <div></div>
    <div><button className="login-button" onClick={()=>navigate('/login')}>Login</button>
         <button className="register-button" onClick={()=>postRegister()}>Register</button>
    </div>
    
  </div>
  </>
  )
}

function Links () {
  return (
  <>
  <div className="links">
  <a href="/instructions" > Ir a instrucciones </a>
  <a href="/about" > Sobre nosotros </a>
  </div>
  </>
  )
}


function Title() {
  return (
    <div className="title">
    <img src={logo}/>
    <h1 className="title-text">
    Empire Conquest
    </h1>
    </div>
  )
}


export default function Login() {
  const [name, setName] = useState(null)
  const [password, setPassword] = useState(null)
  return (
    <>
    <div className="main">
      <img className="background-image" src={background_image} />
      <Title />
      <FormsAndButtons />
      <Links />
    </div>
    </>
  );
}


