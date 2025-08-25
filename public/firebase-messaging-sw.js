importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {

  apiKey: "AIzaSyAj2_tR8FBm5C7OvXfkZdoIstbpX4i-WM0",

  authDomain: "movieexplorer-b12a3.firebaseapp.com",

  projectId: "movieexplorer-b12a3",

  storageBucket: "movieexplorer-b12a3.firebasestorage.app",
  messagingSenderId: "52465435359",

  appId: "1:52465435359:web:810c97d486ad936d9c1f6a",

  measurementId:"G-BFWWK5XDNK",

};
 
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});