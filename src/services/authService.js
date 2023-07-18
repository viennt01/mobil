import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig.js';

firebase.initializeApp(firebaseConfig);

export const authService = {
    loginWithGoogle: async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        if (result.user) {
            const token = await result.user.getIdToken();
            // Make a POST request to the loginGoogle API endpoint with the token
            const response = await fetch('https://capstone-matching.herokuapp.com/api/v1/auth/login-google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data', data);
                // Save the token and user type in local storage
                localStorage.setItem('student_id', data.student.student_id);
                localStorage.setItem('avatar', data.student.avatar);
                localStorage.setItem('access_token', data.access_token);
            } else {
                throw new Error('Failed to log in');
            }
        }
    },
};
