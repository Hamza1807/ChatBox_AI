import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');
    if (storedUsername && storedPassword) {
      setAuthUsername(storedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  function register() {
    if (username && password) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      alert('Registration successful');
    } else {
      alert('Please enter both username and password');
    }
  }

  function login() {
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
      setAuthUsername(username);
      setIsAuthenticated(true);
      alert('Login successful');
    } else {
      alert('Invalid credentials');
    }
  }

  function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    setAuthUsername("");
    setIsAuthenticated(false);
  }

  async function generateAnswer() {
    if (!isAuthenticated) {
      alert('Please log in first');
      return;
    }

    setAnswer("Loading...");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAx2BBfJeQ-v9avMrLMt54iVhnaSG2WL8Y",
        method: "post",
        data: {
          contents: [
            { parts: [{ text: question }] },
          ],
        }
      });

      const answerText = response.data.candidates[0].content.parts[0].text;
      setAnswer(answerText);

      // Update history
      setHistory(prevHistory => [...prevHistory, { question, answer: answerText }]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Error fetching answer");
    }
  }

  function toggleHistoryVisibility() {
    setIsHistoryVisible(!isHistoryVisible);
  }

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="auth-container">
          <h1>Register or Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-box">
            <h1>Chat AI</h1>
            <textarea
              className="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              cols="20"
              rows="10"
            ></textarea>
            <div className="button-container">
              <button className="generate-button" onClick={generateAnswer}>
                Generate Answer
              </button>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
            <p className="answer-display">{answer}</p>
          </div>
          <div className={`history ${isHistoryVisible ? '' : 'hidden'}`}>
            <div className="history-header">
              <h2>Search History</h2>
              <button className="toggle-button" onClick={toggleHistoryVisibility}>
                {isHistoryVisible ? '-' : '+'}
              </button>
            </div>
            <ul>
              {history.map((entry, index) => (
                <li key={index} className="history-item">
                  <strong>Question:</strong> {entry.question}<br />
                  <strong>Answer:</strong> {entry.answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
