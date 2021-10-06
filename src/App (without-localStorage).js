import './App.css';
import initializeAuthentication from './Firebase/Firebase.initialize';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState({});
  const [error, setError] = useState({});

  initializeAuthentication();
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL, metadata } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          image: photoURL,
          lastSignInTime: metadata?.lastSignInTime
        }
        setUser(loggedInUser)
      })
      .catch(err => {
        const errorCollection = {
          errCode: err.code,
          errMessage: err.message,
        }
        setError(errorCollection);
      })
  }
  const handleGithubSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL, metadata } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          image: photoURL,
          lastSignInTime: metadata?.lastSignInTime
        }
        setUser(loggedInUser)
      })
      .catch(err => {
        const errorCollection = {
          errCode: err.code,
          errMessage: err.message,
        }
        setError(errorCollection);
      })
  }

  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser({});
        console.log('sign-out successful')
      })
  }

  const backgroundStyle = {
    backgroundImage: 'linear-gradient(rgba(0.2, 0.2, 0.2, 0.2), rgba(0.8, 0.8, 0.8, 0.8)), url(https://iacademy.qodeinteractive.com/wp-content/uploads/2017/05/h12-parallax-1.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: 'white'
  }

  const bgStyle = {
    backgroundColor: '#3f51b5',
    color: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.9) 2px 4px 8px',
  }

  return (
    <div className="App container-fluid" style={backgroundStyle}>
      <img src="./firebase.ico" width="30px" height="40px" className="img-responsive" alt="" />

      <div className="d-flex justify-content-center pt-5">
        <div className="p-3 rounded-2" style={bgStyle}>
          {
            error.errorCode && <p>{error.errorCode}</p>
          }

          {
            user?.name ?
              <div>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={user.image} width="30px" className="img-fluid rounded-pill me-2" alt={user.name} />
                  <h4>Hey {user.name}!</h4>
                </div>
                <div className="bg-white p-3 rounded text-dark fw-bold my-2">
                  {
                    user?.email &&
                    <p>You're registered with {user.email}</p>
                  }
                  <p>Last signed on {user.lastSignInTime}</p>
                </div>

              </div>
              :
              ""
          }


          {
            !user?.name &&
            <div>
              <Button onClick={handleGoogleSignIn} variant="danger fw-bold border-white shadow"><i className="fab fa-google"></i>oogle Sign-In</Button>
              <Button onClick={handleGithubSignIn} variant="secondary fw-bold border-white shadow ms-2"><i className="fab fa-github"></i> Github Sign-In</Button>
            </div>
          }


          {
            user.name &&
            <Button onClick={logOut} variant="warning fw-bold ms-1 shadow">Log out</Button>
          }

        </div>
      </div>
    </div>
  );
}

export default App;
