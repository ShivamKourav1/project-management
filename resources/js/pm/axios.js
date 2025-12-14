// resources/js/pm/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true, // Important for Sanctum cookie
});

export default instance;
