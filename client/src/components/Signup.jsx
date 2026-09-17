import React from 'react';

function Signup() {
  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <label>
          Name
          <input type="text" placeholder="Enter your name" />
        </label>
        <br />
        <label>
          Email
          <input type="email" placeholder="Enter your email" />
        </label>
        <br />
        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
