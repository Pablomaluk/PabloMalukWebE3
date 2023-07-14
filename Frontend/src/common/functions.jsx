import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context';
import axios from 'axios';


function IterateOverArrayAndReturnTileElements(array, x, y){
    let matches = [];
    for (let element of array){
        if (element.x == x && element.y == y){
            matches.push(element);
        }
    }
    return matches;
}

function GetAvailableWarriors(warriorsArray){
    let availableWarriors = [];
    for (let warrior of warriorsArray){
        if (warrior.canMove){
            availableWarriors.push(warrior);
        }
    }
    return availableWarriors;
}

function CheckIfUserIsLoggedIn(){
    let navigate = useNavigate();
    const {token} = useContext(AuthContext);
    if (!token){
        navigate('/login');
    }
}

async function handleFetch({route, method, token, body=null}){
    let headers = { headers: { authorization: `Bearer ${token}` } };
    if (method == 'get'){
        return await axios.get(`${import.meta.env.VITE_API_URL}/${route}/`, headers);
    }
    if (method == "post"){
        return await axios.post(`${import.meta.env.VITE_API_URL}/${route}/`, body, headers);
    }
}

export {IterateOverArrayAndReturnTileElements, GetAvailableWarriors, CheckIfUserIsLoggedIn,
        handleFetch};