import React from 'react';

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Email:
          <input type="email" placeholder="Enter your email" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" placeholder="Enter your password" />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
