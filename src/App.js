import './App.css';
import initializeAuthentication from './Firebase/Firebase.initialize';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState({});
  const [error, setError] = useState({});

  initializeAuthentication();
  const googleprovider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleprovider)
      .then(result => {
        const { displayName, email, metadata, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          image: photoURL,
          lastLoginTime: metadata.lastSignInTime
        }

        localStorage.setItem(`google-user`, JSON.stringify(loggedInUser));
        window.location.reload();
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const errorCollection = {
          errorCode, errorMessage
        }
        setError(errorCollection);
      })
  }


  const handleGithubSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, metadata, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          image: photoURL,
          lastLoginTime: metadata.lastSignInTime
        }

        localStorage.setItem(`github-user`, JSON.stringify(loggedInUser));
        window.location.reload();
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorCollection = {
          errorCode, errorMessage
        }
        setError(errorCollection);
      })
  }

  const logOut = () => {

    // sign-out from google / github
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // clear data from UI
        setUser({})
        console.log('sign-out successful!')
      }
      )
      .catch(error => console.log(error));

    // clear data from localStorage
    let getGoogleUser = localStorage.getItem(`google-user`);
    let getGithubUser = localStorage.getItem(`github-user`);

    if (getGoogleUser) {
      localStorage.removeItem(`google-user`);
    }
    else if (getGithubUser) {
      localStorage.removeItem(`github-user`);
    }
  }

  useEffect(() => {
    // store data in localStorage
    let getGoogleUser = localStorage.getItem(`google-user`);
    let googleMember = JSON.parse(getGoogleUser);

    let getGithubUser = localStorage.getItem(`github-user`);
    let githubMember = JSON.parse(getGithubUser);

    if (googleMember) {
      setUser(googleMember);
    }
    else if (githubMember) {
      setUser(githubMember);
    }
  }, []);

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
          {/* error msg */}
          {
            error.errorCode && <p>{error.errorCode}</p>
          }

          {/* show google / github sign-in info */}
          {
            user?.name &&
            <div>
              <div className="d-flex justify-content-center align-items-center">
                <img src={user.image} width="30px" className="img-fluid rounded-pill border border-white border-1 me-2" alt={user.name} />
                <h4 className="fw-bold">Hey  <a href="/" className="text-decoration-none text-white">{user.name}!</a></h4>
              </div>

              <div className="bg-white p-3 rounded text-dark fw-bold my-2">
                {
                  user?.email &&
                  <p>You're registered with {user.email}</p>
                }
                <p>Last signed on {user.lastLoginTime}</p>
              </div>

            </div>
          }


          {/* google / github sign-in */}
          {
            !user?.name &&
            <div>
              <Button onClick={handleGoogleSignIn} variant="danger fw-bold border-white shadow"><i className="fab fa-google"></i>oogle Sign-In</Button>
              <Button onClick={handleGithubSignIn} variant="secondary fw-bold border-white shadow ms-2"><i className="fab fa-github"></i> Github Sign-In</Button>
            </div>
          }

          {/* log-out */}
          {
            user?.name && <Button onClick={logOut} variant="warning fw-bold ms-1 shadow">Log-Out</Button>
          }

        </div>
      </div>
    </div >
  );
}

export default App;
