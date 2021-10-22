import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setUserSession} from '../utils/Common';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember_token, setRememberToken] = useState('');

    const HandleLogin = () => {
        axios.post("http://training.uk/api/login", {
            email: email,
            password: password,
            remember_token: remember_token
        }). then(response => {
            if(response.data.code == 200){
                setUserSession(response.data.code);
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: response.data.msg,
                    icon: 'warning',
                })
            }
        }). catch (error => {
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
                        <a href="../../index2.html"><b>Admin</b>LTE</a>
                    </div>
                    <div className="card">
                        <div className="card-body login-card-body">
                            <form>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Email"
                                        value = {email}
                                        onChange = {e => setEmail(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="password" className="form-control" placeholder="Password" 
                                        value = {password}
                                        onChange = {e => setPassword(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-8">
                                        <div className="icheck-primary">
                                            <input type="checkbox" id="remember" 
                                                onChange = {e => setRememberToken(e.target.checked)}
                                            />
                                            <label htmlFor="remember">
                                                Remember Me
                                            </label>
                                        </div>
                                    </div>
                                    {/* /.col */}
                                    <div className="col-4">
                                        <input type="button" onClick={HandleLogin} className="btn btn-primary btn-block" value="Sign In"/>
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