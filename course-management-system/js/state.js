export const state = {
    currentUser: JSON.parse(localStorage.getItem('ss_user')) || null,
    selectedCourse: null,
    courses: [],
    notifications: []
};

export function setCurrentUser(user) {
    state.currentUser = user;
    if (user) {
        localStorage.setItem('ss_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('ss_user');
    }
}