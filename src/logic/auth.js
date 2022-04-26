import axios from "axios";

const ENDPOINT_PATH = "http://127.0.0.1:8001/api/";
const CONFIG = {
    'Content-Type' : 'application/json',
    'token_type': "bearer",
    'headers': { Authorization: 'Bearer ' + localStorage.getItem('token')
    }
};

export default {
  login(credenciales) {
    return axios.post(ENDPOINT_PATH + "login", credenciales);
  },

  logout(){
    console.log(CONFIG)
    return axios.post(ENDPOINT_PATH + "logout", [], CONFIG);
  }

};