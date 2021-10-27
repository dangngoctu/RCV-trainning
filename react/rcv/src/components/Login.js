import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setUserSession } from '../utils/Common';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onChange" // "onChange"
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember_token, setRememberToken] = useState('');
    let history = useHistory();

    const HandleLogin = () => {
        axios.post("http://training.uk/api/login", {
            email: email,
            password: password,
            remember_token: remember_token
        }).then(response => {
            if (response.data.code === 200) {
                setUserSession(response.data.data);
                history.push("/home");
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: response.data.msg,
                    icon: 'warning',
                })
            }
        }).catch(error => {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                icon: 'error',
            })
        });
    }

    return (
        <div>
            <div className="login-page">
                <div className="login-box">
                    {/* /.login-logo */}
                    <div className="login-logo">
                        <img src="dist/img/logo2.png" alt="Logo" style={{ opacity: '.8' }} />
                    </div>
                    <div className="card">
                        <div className="card-body login-card-body">
                            <form>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Email"
                                        {...register("email", {
                                            required: 'Email không được trống!',
                                            minLength: {
                                                value: 5,
                                                message: 'Email tối thiểu 5 kí tự!'
                                            },
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email không hợp lệ',
                                            }
                                        })}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                <div className="input-group mb-3">
                                    <input type="password" className="form-control" placeholder="Password"
                                        {...register("password", {
                                            required: 'Mật khẩu không được trống!'
                                        })}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                <div className="row">
                                    <div className="col-8">
                                        <div className="icheck-primary">
                                            <input type="checkbox" id="remember" required
                                                onChange={e => setRememberToken(e.target.checked)}
                                            />
                                            <label htmlFor="remember">
                                                Remember Me
                                            </label>
                                        </div>
                                    </div>
                                    {/* /.col */}
                                    <div className="col-4">
                                        <input type="button" onClick={handleSubmit(HandleLogin)} className="btn btn-primary btn-block" value="Sign In" />
                                    </div>
                                    {/* /.col */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
