import { state, setCurrentUser } from './state.js';

export function login(email, password) {
    const users = JSON.parse(localStorage.getItem('ss_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    setCurrentUser(user);
    return user;
}

export function logout() {
    setCurrentUser(null);
    window.location.href = '../auth/student-login.html';
}

export function register(userData) {
    const users = JSON.parse(localStorage.getItem('ss_users')) || [];
    users.push(userData);
    localStorage.setItem('ss_users', JSON.stringify(users));
    setCurrentUser(userData);
}