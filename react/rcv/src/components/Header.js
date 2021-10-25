import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { removeToken, getToken } from '../utils/Common';
import { useHistory } from "react-router-dom";


const Header = () => {
	let history = useHistory();
	const HandleLogout = () => {
		axios.post("http://training.uk/api/logout", { 
			
        },
		{
			headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + getToken()
			}
		}).then(response => {
            if(response.data.code === 200){
                removeToken();
				history.push("/");
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
			<nav className="main-header navbar navbar-expand navbar-white navbar-light">
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<a href="#" onClick={HandleLogout} className="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
							<i className="fas fa-door-closed"></i>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Header
