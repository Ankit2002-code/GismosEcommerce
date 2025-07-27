import React, { useState } from "react";
import axios from 'axios';
import config from '../../config.js';
import { toast } from "react-toastify";

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(email.trim().length < 1 || pass.length < 1) {
            toast.warning("Please fill all the details");
            setIsLoading(false);
            return;
        }
        
        axios.post(config.getBackendUrl("/login-gismos"), {email: email, password: pass})
        .then((res) => {
            toast.success(res.data.message);
            if (res.data.valid) {
                localStorage.setItem(config.localTokenKey, res.data.token);
                document.location.href = config.prefix;
            }
        })
        .catch((err) => {
            toast.error(err.response ? err.response.data.message : "Some error occurred");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <div className={`auth-form-container ${isLoading ? 'loading' : ''}`}>
            <button className="back-to-home-button" onClick={()=>{document.location.href = config.prefix}}>
                Back to Home
            </button>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue shopping</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        placeholder="Enter your email address" 
                        id="email" 
                        name="email"
                        disabled={isLoading}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        value={pass} 
                        onChange={(e) => setPass(e.target.value)} 
                        type="password" 
                        placeholder="Enter your password" 
                        id="password" 
                        name="password"
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
            
            <div className="form-divider">
                <span>or</span>
            </div>
            
            <div className="social-login">
                <button type="button" className="social-btn google" disabled={isLoading}>
                    Continue with Google
                </button>
                <button type="button" className="social-btn facebook" disabled={isLoading}>
                    Continue with Facebook
                </button>
            </div>
            
            <button className="link-btn" onClick={() => props.onFormSwitch('register')} disabled={isLoading}>
                Don't have an account? Sign up here
            </button>
        </div>
    )
}