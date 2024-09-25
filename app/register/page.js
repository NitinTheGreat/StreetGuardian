'use client';
import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';
import '../../css/SignUp.css';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = password === confirmPassword && isEmailValid(email) && username && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://ao3-chrome-extension-backend.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful. Please log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="parent">
    <div className="signup-container">
      <div className="signup-image">
        <img src="../images/signup.png" alt="Signup background" />
      </div>
      <div className="signup-form-wrapper">
        <div className="signup-form">
          <h2>SIGN UP</h2>
          <p>Join now to unlock exclusive tools and keep your AO3 fanfiction journey organized !</p>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FiUser className="icon" />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FiMail className="icon" />
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <FiLock className="icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="input-group">
              <FiLock className="icon" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button type="submit" className="submit-button" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="login-link">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
    </div>
  );
}