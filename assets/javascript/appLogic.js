// Initialize Firebase
var config = {
  apiKey: "AIzaSyCslpdmM8wX_Dao5Ed4DaOHUp6oXLKEISQ",
  authDomain: "batman-superman-velociraptors.firebaseapp.com",
  databaseURL: "https://batman-superman-velociraptors.firebaseio.com",
  projectId: "batman-superman-velociraptors",
  storageBucket: "batman-superman-velociraptors.appspot.com",
  messagingSenderId: "1040495803238"
};
firebase.initializeApp(config);

var database = firebase.database();