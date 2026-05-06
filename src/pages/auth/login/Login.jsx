import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/slice/authSlice';
import logo from '../../../assets/logo.jpg';
import './Login.scss';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ loginId: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storeVar = useSelector(state => state.auth);
    const { uploading } = useSelector((state) => state.loader);

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.loginId) {
            newErrors.loginId = "* Please Enter Login ID";
        }

        if (!formData.password) {
            newErrors.password = "* Please Enter Password";
        } else if (formData.password.length < 6) {
            newErrors.password = "* Password must be at least 6 characters";
        } else if (formData.password.length > 20) {
            newErrors.password = "* Password must not exceed 20 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(loginUser(formData, navigate));
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__container">
                <img src={logo} alt="FlexiTrip Logo" />
                <h2 className="login-page__title">Welcome To FlexiTrip Admin</h2>
                <form className="login-page__form" >
                    <div className="login-page__form-group">
                        <input
                            type="text"
                            name="loginId"
                            placeholder="Login ID"
                            value={formData.loginId}
                            onChange={handleFormData}
                        />
                        {errors.loginId && <div className="error">{errors.loginId}</div>}
                    </div>
                    <div className="login-page__form-group">
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleFormData}
                                minLength={6}
                                maxLength={20}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                            </button>
                        </div>
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <button onClick={handleSubmit} className="login-page__form-submit" type="submit" disabled={storeVar?.loadingStatus}>
                        {uploading ? (
                            <span className="login-page__form-spinner"></span>
                        ) : (
                            <>
                                Login
                                <span>→</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;