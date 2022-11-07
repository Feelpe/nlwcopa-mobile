import axios from 'axios';

export const api = axios.create({
  baseURL: `http://192.168.0.124:3333/`,
  // baseURL: `http://${process.env.HOST}:${process.env.PORT}/`,
});