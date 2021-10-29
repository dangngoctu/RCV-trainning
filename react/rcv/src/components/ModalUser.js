import React, { useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const ModalUser = (props) => {

    let history = useHistory();
    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors
    } = useForm({
        mode: "onChange"
    });

    const SubmitUser = () => {
        axios.post("http://training.uk/api/user/action", {
            action: props.action,
            id: props.id,
            name: window.$('#name').val(),
            email: window.$('#email').val(),
            password: window.$('#password').val(),
            re_password: window.$('#re_password').val(),
            group_role: window.$('#group_role').val(),
            is_active: window.$('#is_active').val()
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.data.code === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: '',
                    icon: 'success',
                })
                window.$('#modalUser').modal('hide');
                props.userData()
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: response.data.msg,
                    icon: 'warning',
                })
            }
        }).catch(error => {
            if(error.response.status === 401 || error.response.status === 400){
                removeToken('token');
                history.push('/');
            } else {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                    icon: 'error',
                })
            }
        });
    }

    useEffect(() => {
        props.childFunc.current = clearErrors
    }, [])

    return (
        <div>
            <div className="modal fade" id="modalUser">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Default Modal</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-md-12">
                                    <form id="FormModal">
                                        <div className="form-group row">
                                            <label htmlFor="inputName" className="col-sm-2 col-form-label">Họ tên</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" id="name" placeholder="Tên"
                                                    {...register("name", {
                                                        required: 'Tên không được trống!',
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Tên phải lớn hơn 5 kí tự.'
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Tên tối đa 255 kí tự!'
                                                        },
                                                    })}
                                                />
                                                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                            </div>
                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label mg-t-10">Email</label>
                                            <div className="col-sm-10">
                                                <input type="email" step="1" className="form-control mg-t-10" id="email" placeholder="Email"
                                                    {...register("email", {
                                                        required: 'Email không được trống!',
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Email tối thiểu 5 kí tự!'
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Email tối đa 255 kí tự!'
                                                        },
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Email không hợp lệ',
                                                        }
                                                    })}
                                                />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                            </div>
                                            <label htmlFor="inputPassword" className="col-sm-2 col-form-label mg-t-10">Mật khẩu</label>
                                            <div className="col-sm-10 mg-t-10">
                                                <input type="password" className="form-control" id="password" placeholder="Mật khẩu"
                                                    {...register("password", {
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Mật khẩu lớn hơn 5 kí tự.'
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Mật khẩu tối đa 255 kí tự!'
                                                        },
                                                    })}
                                                />
                                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                            </div>
                                            <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label mg-t-10">Xác nhận</label>
                                            <div className="col-sm-10 mg-t-10">
                                                <input type="password" className="form-control" id="re_password" placeholder=" Xác nhận mật khẩu"
                                                    {...register("re_password", {
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Xác nhận mật khẩu lớn hơn 5 kí tự.'
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Xác nhận mật khẩu tối đa 255 kí tự!'
                                                        }
                                                    })}
                                                />
                                                {errors.re_password && <p className="text-danger">{errors.re_password.message}</p>}
                                            </div>
                                            <label htmlFor="inputIsSales" className="col-sm-2 col-form-label mg-t-10">Nhóm</label>
                                            <div className="col-sm-10">
                                                <select className="form-control mg-t-10" id="group_role">
                                                    <option label="Chọn nhóm"></option>
                                                    <option value="1">Admin</option>
                                                    <option value="2">Editer</option>
                                                    <option value="3">Reviewer</option>
                                                </select>
                                            </div>
                                            <label htmlFor="inputIsActive" className="col-sm-2 col-form-label mg-t-10">Trạng Thái</label>
                                                <div className="col-sm-10 mg-t-10">
                                                    <input type="checkbox" id="is_active"/>
                                                </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit(SubmitUser)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalUser
