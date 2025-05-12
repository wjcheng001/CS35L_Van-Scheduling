import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function App() {
  const [msg, setMsg] = useState('');
  const [user,setUser] = useState(null)

  // useEffect(() => {
  //   fetch('/api/test')
  //     .then((res) => res.json())
  //     .then((data) => setMsg(data.message))
  //     .catch((err) => console.error('API error:', err));
  // }, []);

  return (
    <div>
      <h1>{msg || "Loading..."}</h1>

      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("User info:", decoded);

            if (decoded.email && decoded.email.endsWith('@g.ucla.edu')) {
              setUser(decoded);
              setError('');
            } else {
              setError('Only @g.ucla.edu email addresses are allowed.');
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <img src={user.picture} alt="profile" />
        </div>
      )}
    </div>
  );
}

export default App;