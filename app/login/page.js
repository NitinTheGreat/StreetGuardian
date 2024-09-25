import React, { useState, useEffect } from 'react';
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  
  const [password, setPassword]
    = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(()=> {
    // Check for existing tokens in localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('Checking tokens:', { accessToken, refreshToken });

    if (accessToken && refreshToken) {
      // Validate tokens before redirecting
      const checkAuth = async () => {
        try {
          const response = await fetch('https://ao3-chrome-extension-backend.onrender.com/auth/validate', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Tokens': JSON.stringify({ accessToken, refreshToken }),
            },
          });

          if (response.ok) {
            window.location.href = '/dashboard';
          } else {
            // Tokens are invalid
            console.log('Token validation failed:', response.status);
            alert('Token validation failed');
          }
        } catch (error) {
          console.error('Error during token validation:', error);
        }
      };

      checkAuth();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://ao3-chrome-extension-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });
  
      const data = await response.json();
      console.log('Response:', response);
      console.log('Response data:', data);
  
      if (response.ok) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Send both tokens to the Chrome extension
        chrome.runtime.sendMessage("nnmmeljlhmhpnfphcpifdahblfmhlilm", 
          { action: "storeTokens", accessToken: data.accessToken, refreshToken: data.refreshToken }, 
          function(response) {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
            } else {
              console.log('Tokens sent to extension:', response);
            }
        });
        
        
        setMessage('Login successful');
        setMessageType('success');
  
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setMessage(data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    }
  };
  



return (
  <div className="login-container">
    <div className="login-left">
      {/* Logo placeholder */}
      {/* <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100px', 
          height: '100px', 
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            border: '20px solid #1e3a8a',
            borderTopColor: 'white',
            transform: 'rotate(45deg)'
          }}></div>
        </div> */}
      <img src="../images/login1.png" alt="" />
    </div>
    <div className="login-right">
      <div className="login-form-container">
        <div className="login-form">
          <h1 style={{ color: '#1e3a8a', fontSize: '24px', marginBottom: '8px' }}>Welcome back!</h1>
          <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '24px' }}>
            Log in to access your personalized AO3 tools. Continue your fanfiction journey right where you left off.
          </p>

          <h2 style={{ color: '#1e3a8a', fontSize: '18px', marginBottom: '16px' }}>LOGIN</h2>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>

              <input

                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />

            </div>
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  paddingRight: '40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="remember-forgot">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" style={{ color: '#1e3a8a', fontSize: '14px', textDecoration: 'none' }}>Forgot Password?</a>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '50px'

              }}
            >
              Log In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#4b5563' }}>
            Don't have an account? <a href="/signup" style={{ color: '#1e3a8a', textDecoration: 'none' }}>Signup</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}