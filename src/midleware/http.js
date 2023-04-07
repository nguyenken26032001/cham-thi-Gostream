
import axios from 'axios';

const HTTP = axios.create({
  baseURL: 'http://localhost:3000/api/',
  // headers: {
  //   Authorization: 'Bearer {token}'
  // }
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
HTTP.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export {HTTP}