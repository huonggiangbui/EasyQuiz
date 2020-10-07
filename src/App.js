import React, { useEffect, useState } from "react";

import './App.css';

import { auth, firestore as db } from './firebase/firebase.util';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavBar from './components/navbar';
import Footer from './components/footer';

import HomePage from './pages/homepage';
import AboutPage from './pages/about';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import Dashboard from './pages/dashboard';
import CreateTestPage from './pages/test/createTest';
import ExamPage from './pages/exam';
import TakingExamPage from './pages/exam/examtaking';
import TeacherResult from './pages/exam/examTeacherResult';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    authListener();
  },[user])

  const authListener = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.collection('users')
          .doc(user.uid)
          .get()
          .then(doc => {
            if (!doc.exists) {
              return setUser(null)
            }
            setUser(user)
            setUserData(({...doc.data(), userId: user.uid}))
          })
      } 
      else {
        setUser(null)
      }
    })
  }

  return (
    <Router>
      <Route>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <HomePage user={user} />
          </Route>
          <Route exact path="/about" component={AboutPage} />
          {!user 
            ? <Route>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignUpPage} />
              </Route> 
            : <Route>
                <Route exact path="/dashboard">
                  <Dashboard userData={userData} />
                </Route>
                <Route exact path="/test/:testId">
                  <ExamPage userData={userData} />
                </Route>
                {userData.role === "teacher"
                  ? <Route>
                      <Route exact path="/createTest">
                        <CreateTestPage userData={userData} />
                      </Route>
                      <Route exact path="/test/:testId/result" component={TeacherResult} />
                    </Route> 
                : <Route>
                    <Route exact path="/test/:testId/taking">
                      <TakingExamPage userData={userData} />
                    </Route>
                  </Route> 
                }
              </Route>
            }
        </Switch>
        <Footer />
      </Route>
    </Router>
  )
}