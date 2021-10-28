import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import ModalUser from './ModalUser';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";

const User = () => {

    const [action, setAction] = useState('create');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [is_active, setIsActive] = useState('');
    const [group_role, setGroupRole] = useState('');
    let [data, setData] = useState([]);
    let history = useHistory();

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
    }, []);

    const UserData = () => {
        axios.post("http://training.uk/api/user", {
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

    let ClearSearch = () => {
        window.$('#FormSearch')[0].reset();
        UserData();
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
                axios.post("http://training.uk/api/user/action", {
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
                axios.post("http://training.uk/api/user/action", {
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

    let ClearModal = () => {
        window.$('#FormModal')[0].reset();
    }

    const onUpdate = (customer_id) => {
        ClearModal();
        setAction('update');
        setId(customer_id);
        window.$('#modalUser .modal-title').html('Cập nhật nhân viên');
        axios.post("http://training.uk/api/user/detail", {
            id: customer_id
        },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        }).then(response => {
            if (response.data.code === 200) {
                window.$('#name').val(response.data.data.name);
                window.$('#email').val(response.data.data.email);
                window.$('#group_role').val(response.data.data.group_role).trigger('change');
                if(response.data.data.is_active === 1){
                    window.$('#is_active').prop('checked', true);
                }
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
        ClearModal();
        setAction('create');
        window.$('#modalUser .modal-title').html('Thêm nhân viên');
        window.$('#modalUser').modal('show');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <ModalUser action={action} id={id} userData={UserData}/>
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <form id="FormSearch">
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputName">Tên</label>
                                        <input type="text" className="form-control" id="InputName" placeholder="Nhập họ tên"
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputEmail">Email</label>
                                        <input type="text" className="form-control" id="InputEmail" placeholder="Nhập email"
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputGroupRole">Nhóm</label>
                                        <select className="form-control" id="InputGroupRole"
                                            onChange={e => setGroupRole(e.target.value)}>
                                            <option label="Chọn nhóm"></option>
                                            <option value="1">Admin</option>
                                            <option value="2">Editer</option>
                                            <option value="2">Reviewer</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputIsActive">Trạng thái</label>
                                        <select className="form-control" id="InputIsActive"
                                            onChange={e => setIsActive(e.target.value)}>
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
        </div>
    )
}

export default User
