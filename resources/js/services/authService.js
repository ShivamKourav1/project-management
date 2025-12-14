import axios from "../lib/axios";

export async function login(email, password) {
    // STEP 1: Get CSRF cookie
    await axios.get("/sanctum/csrf-cookie");

    // STEP 2: Login
    const response = await axios.post("/login", {
        email,
        password
    });

    return response.data;
}

export async function logout() {
    await axios.post("/logout");
}

export async function getMe() {
    const response = await axios.get("/api/me");
    return response.data;
}
