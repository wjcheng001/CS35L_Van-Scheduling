import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error('API error:', err));
  }, []);

  return <h1>{msg || "Loading..."}</h1>;
}

export default App;
