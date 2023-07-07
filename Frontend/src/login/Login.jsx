import { useState } from "react"
import './styles.css';
import background_image from './imgs/warrior.jpeg';
import logo from './imgs/logo.png'


function FormsAndButtons() {
  return (
  <>
  <div className="forms-and-buttons-container">
    <div><h4 className="text">Username:</h4></div>
    <div><input></input></div>
    <div><h4 className="text">Password:</h4></div>
    <div><input></input></div>
    <div></div>
    <div><button className="login-button">Login</button>
         <button className="register-button">Register</button>
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
    <h1>
    Empire Conquest I
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


