import { state } from './state.js';
import { logout } from './auth.js';

export function renderUserHeader() {
    if (!state.currentUser) return;
    document.querySelectorAll('.user-info h4').forEach(el => el.textContent = state.currentUser.name);
    document.querySelectorAll('.avatar').forEach(el => el.textContent = state.currentUser.initials || 'JS');
}

export function bindLogoutButtons() {
    document.querySelectorAll('.btn-logout').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
}