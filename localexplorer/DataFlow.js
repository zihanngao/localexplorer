import base64 from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://131.179.3.81:5000"; 

export const createUser = async (username, password) => {
    const requestContent = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    };
    const res = await fetch(`${API_URL}/users`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await login(username, password);
};

export const login = async (username, password) => {
    let auth = base64.encode(`${username}:${password}`);
    const requestContent = {
        method: "GET",
        headers: {
            Authorization: `Basic ${auth}`
        }
    };
    const res = await fetch(`${API_URL}/login`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    const token = await res.json();
    try {
        await AsyncStorage.setItem("token", token.token);
        await AsyncStorage.setItem("username", username);
    } catch (e) {
        console.log(e);
    }
    return token;
};

export const getUser = async (token, username) => {
    const requestContent = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const res = await fetch(`${API_URL}/users/${username}`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const updateUser = async (
    token,
    username,
    firstName = "",
    lastName = "",
    goalDailyCalories = 0,
    goalDailyProtein = 0,
    goalDailyCarbohydrates = 0,
    goalDailyFat = 0,
    goalDailyActivity = 0
) => {
    const requestContent = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            firstName,
            lastName,
            goalDailyCalories,
            goalDailyProtein,
            goalDailyCarbohydrates,
            goalDailyFat,
            goalDailyActivity
        })
    };
    const res = await fetch(`${API_URL}/users/${username}`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const addExercise = async (token, name, duration, date, calories) => {
    const requestContent = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            duration,
            date,
            calories
        })
    };
    const res = await fetch(`${API_URL}/activities`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const getExercises = async (token) => {
    const requestContent = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const res = await fetch(`${API_URL}/activities`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const getExercise = async (token, id) => {
    const requestContent = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const res = await fetch(`${API_URL}/activities/${id}`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const updateExercise = async (token, id, name, duration, date, calories) => {
    const requestContent = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            duration,
            date,
            calories
        })
    };
    const res = await fetch(`${API_URL}/activities/${id}`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};

export const deleteExercise = async (token, id) => {
    const requestContent = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const res = await fetch(`${API_URL}/activities/${id}`, requestContent);
    if (!res.ok) {
        const err = await res.json();
        throw err.message;
    }
    return await res.json();
};