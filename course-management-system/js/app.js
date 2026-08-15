import { state } from './state.js';
import { renderUserHeader, bindLogoutButtons } from './ui.js';
import { validateForm } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    renderUserHeader();
    bindLogoutButtons();
});