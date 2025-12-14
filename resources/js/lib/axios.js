import axios from "axios";

axios.defaults.baseURL = "";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default axios;
