// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            const success = login(email, password);
            if (success) {
                navigate("/dashboard");
            } else {
                setError("Email atau password salah");
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Selamat Datang</h1>
                    <p>Silakan login untuk melanjutkan</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <span className="input-span">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </span>
                    <span className="input-span">
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </span>
                    <span className="span">
                        <a href="#">Forgot password?</a>
                    </span>
                    <input
                        className="submit"
                        type="submit"
                        value={loading ? "Loading..." : "Log in"}
                        disabled={loading}
                    />
                    <span className="span">
                        Don't have an account? <a href="#">Sign up</a>
                    </span>
                </form>
            </div>
        </div>
    );
}