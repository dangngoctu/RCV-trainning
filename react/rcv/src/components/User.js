import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const User = () => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors,
        reset
    } = useForm({
        mode: "onChange"
    });
    const [action, setAction] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [is_active, setIsActive] = useState('');
    const [group_role, setGroupRole] = useState('');
    const [user_name, setUserName] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [user_is_active, setUserIsActive] = useState(true);
    const [user_group_role, setUserGroupRole] = useState('');
    const [user_password, setUserPassword] = useState('');
    const [user_repassword, setUserRepassword] = useState('');
    let [data, setData] = useState([]);
    let history = useHistory();
    let [dataSearch, setDataSearch] = useState({
        name: name,
        email: email,
        is_active: is_active,
        group_role: group_role
    });

    const columns = [
        {
            name: '#',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Họ tên',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Nhóm',
            selector: row => (row.group_role) === 1 ? "Admin": (row.group_role) === 2 ? "Editor": (row.group_role) === 3 ? "Reviewer" : ""
        },
        {
            name: 'Trạng thái',
            selector: row => (row.is_active) === 1 ? <div><span className="text-success">Đang hoạt động</span></div>: <div><span className="text-danger">Tạm khóa</span></div>
        },
        {
            name: '',
            selector: (row) => <div><span data-toggle="tooltip" data-placement="top" title="View User" data-html="true" className="btn-action table-action-view cursor-pointer text-success" onClick={() => onUpdate(row.id)}><i className="fa fa-edit"></i></span>
                <span data-toggle="tooltip" data-placement="top" title="Delete User" data-html="true" className="btn-action table-action-delete cursor-pointer text-danger mg-l-5" onClick={() => onDelete(row.id)}><i className="fa fa-trash"></i></span>
                <span data-toggle="tooltip" data-placement="top" title="Active User" data-html="true" className="btn-action table-action-delete cursor-pointer mg-l-5" onClick={() => onActive(row.id, row.is_active)}><i className="fas fa-user-times"></i></span>
            </div>
        }
    ];

    const paginationComponentOptions = {
        rowsPerPageText: 'Hiển thị',
        rangeSeparatorText: 'tới',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    };

    useEffect(() => {
        UserData();
        if(action === "create") {
            register('password', { 
                required: 'Mật khẩu không được trống',
                minLength: {
                    value: 5,
                    message: 'Xác nhận mật khẩu lớn hơn 5 kí tự.'
                },
                maxLength: {
                    value: 255,
                    message: 'Xác nhận mật khẩu tối đa 255 kí tự!'
                }
            })
        } else if (action === "update") {
            register('password', { 
                minLength: {
                    value: 5,
                    message: 'Xác nhận mật khẩu lớn hơn 5 kí tự.'
                },
                maxLength: {
                    value: 255,
                    message: 'Xác nhận mật khẩu tối đa 255 kí tự!'
                }
            })
        } else {
        }
    }, [dataSearch, action]);

    const UserData = () => {
        axios.post("https://cardbey-dev.tech/api/public/api/user", {
            name: window.$('#FormSearch #InputName').val(),
            email: window.$('#FormSearch #InputEmail').val(),
            group_role: window.$('#FormSearch #InputGroupRole').val(),
            is_active: window.$('#FormSearch #InputIsActive').val()
        },
        {
            headers: {
                "access-control-allow-Origin" : "*",
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.data.code === 200) {
                setData([...response.data.data]);
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

    const SubmitUser = () => {
        axios.post("https://cardbey-dev.tech/api/public/api/user/action", {
            action: action,
            id: id,
            name: user_name,
            email: user_email,
            password: user_password,
            re_password: user_repassword,
            group_role: user_group_role,
            is_active: user_is_active
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
                UserData()
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

    let ClearSearch = () => {
        setName('');
        setEmail('');
        setIsActive(true);
        setGroupRole('');
        setDataSearch({
            name: name,
            email: email,
            is_active: is_active,
            group_role: group_role
        });
    }

    let onDelete = (userId) => {
        Swal.fire({
            title: 'Bạn có muốn xoá user này?',
            text: "Bạn sẽ không thể hoàn lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("https://cardbey-dev.tech/api/public/api/user/action", {
                    action: 'delete',
                    id: userId,
                },
                {
                    headers: {
                        "access-control-allow-Origin" : "*",
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
                        UserData();
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
        })
    }

    let onActive = (userId, isActive) => {
        let titleContent = "";
        if(isActive === 1){
            titleContent = "Bạn có muốn khóa user này?";
        } else {
            titleContent = "Bạn có muốn mở khóa user này?"
        }
        
        Swal.fire({
            title: titleContent,
            text: "Bạn sẽ không thể hoàn lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("https://cardbey-dev.tech/api/public/api/user/action", {
                    action: 'disable',
                    id: userId,
                },
                {
                    headers: {
                        "access-control-allow-Origin" : "*",
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
                        UserData();
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
        })
    }

    let ClearModal = (action) => {
        if(action === "create") {
            window.$('#email').prop('readonly', false);
        } else {
            window.$('#email').prop('readonly', true);
        }
        setAction(action);
        setUserName('');
        setUserEmail('');
        setUserPassword('');
        setUserRepassword('');
        setUserGroupRole('');
        setUserIsActive(true);
        clearErrors();
        reset();
    }

    const onUpdate = (customer_id) => {
        ClearModal('update');
        setId(customer_id);
        window.$('#modalUser .modal-title').html('Cập nhật nhân viên');
        axios.post("https://cardbey-dev.tech/api/public/api/user/detail", {
            id: customer_id
        },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        }).then(response => {
            if (response.data.code === 200) {
                setUserName(response.data.data.name);
                setUserEmail(response.data.data.email);
                if(response.data.data.is_active === 1){
                    setUserIsActive(true);
                } else {
                    setUserIsActive(false);
                }
                setUserGroupRole(response.data.data.group_role);
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
        window.$('#modalUser').modal('show');
    }

    let CreateModal = () => {
        ClearModal("create");
        window.$('#modalUser .modal-title').html('Thêm nhân viên');
        window.$('#modalUser').modal('show');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <form id="FormSearch">
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputName">Tên</label>
                                        <input type="text" className="form-control" id="InputName" placeholder="Nhập họ tên" value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputEmail">Email</label>
                                        <input type="text" className="form-control" id="InputEmail" placeholder="Nhập email" value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputGroupRole">Nhóm</label>
                                        <select className="form-control" id="InputGroupRole"
                                            onChange={e => setGroupRole(e.target.value)} value={group_role}>
                                            <option label="Chọn nhóm"></option>
                                            <option value="1">Admin</option>
                                            <option value="2">Editer</option>
                                            <option value="3">Reviewer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputIsActive">Trạng thái</label>
                                        <select className="form-control" id="InputIsActive"
                                            onChange={e => setIsActive(e.target.value)} value={is_active}>
                                            <option label="Chọn trạng thái"></option>
                                            <option value="1">Đang hoạt động</option>
                                            <option value="0">Tạm Khóa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={CreateModal} className="mg-b-5 btn btn-block btn-success" value="Thêm mới"/>
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={UserData} className="mg-b-5 btn btn-block btn-primary" value="Tìm kiếm" />
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ClearSearch} className="mg-b-5 btn btn-block btn-secondary" value="Xoá tìm" />
                            </div>
                        </div>
                    </div>
                    <div className="datatable">
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            responsive
                        />
                    </div>
                </div>
            </div>

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
                                                <input type="text" className="form-control" id="name" placeholder="Tên" value={user_name}
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
                                                    onChange={(e) => setUserName(e.target.value)}
                                                />
                                                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                            </div>
                                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label mg-t-10">Email</label>
                                            <div className="col-sm-10">
                                                <input type="email" step="1" className="form-control mg-t-10" id="email" placeholder="Email" value={user_email}
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
                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                            </div>
                                            <label htmlFor="inputPassword" className="col-sm-2 col-form-label mg-t-10">Mật khẩu</label>
                                            <div className="col-sm-10 mg-t-10">
                                                <input type="password" className="form-control" id="password" name="password" placeholder="Mật khẩu" 
                                                    {...register("password", {
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Xác nhận mật khẩu lớn hơn 5 kí tự.'
                                                        },
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Xác nhận mật khẩu tối đa 255 kí tự!'
                                                        }
                                                    })}
                                                    onChange={(e) => setUserPassword(e.target.value)}
                                                />
                                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                            </div>
                                            <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label mg-t-10">Xác nhận</label>
                                            <div className="col-sm-10 mg-t-10">
                                                <input type="password" className="form-control" id="re_password" name="re_password" placeholder=" Xác nhận mật khẩu" 
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
                                                    onChange={(e) => setUserRepassword(e.target.value)}
                                                />
                                                {errors.re_password && <p className="text-danger">{errors.re_password.message}</p>}
                                            </div>
                                            <label htmlFor="inputIsSales" className="col-sm-2 col-form-label mg-t-10">Nhóm</label>
                                            <div className="col-sm-10">
                                                <select className="form-control mg-t-10" id="group_role" onChange={(e) => setUserGroupRole(e.target.value)} 
                                                    value={user_group_role}>
                                                    <option label="Chọn nhóm"></option>
                                                    <option value="1">Admin</option>
                                                    <option value="2">Editer</option>
                                                    <option value="3">Reviewer</option>
                                                </select>
                                            </div>
                                            <label htmlFor="inputIsActive" className="col-sm-2 col-form-label mg-t-10">Trạng Thái</label>
                                                <div className="col-sm-10 mg-t-10">
                                                    <input type="checkbox" id="is_active" onChange={(e) => setUserIsActive(e.target.checked)} defaultChecked={user_is_active}/>
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

export default User
