import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import ModalImportCustomer from './ModalImportCustomer';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const Customer = () => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors,
        reset,
        setValue
    } = useForm({
        mode: "onChange" // "onChange"
    });
    let [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [is_active, setIsActive] = useState('');
    const [action, setAction] = useState('create');
    const [id, setId] = useState('');
    const [customer_name, setCustomerName] = useState('');
    const [customer_email, setCustomerEmail] = useState('');
    const [customer_tel_num, setCustomerTelNum] = useState('');
    const [customer_address, setCustomerAddress] = useState('');
    const [customer_is_active, setCustomerIsActive] = useState(true);
    let history = useHistory();
    const columns = [
        {
            name: '#',
            selector: row => row.customer_id,
            sortable: true,
        },
        {
            name: 'Họ Tên',
            selector: row => row.customer_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Địa chỉ',
            selector: row => row.address,
        },
        {
            name: 'Điện thoại',
            selector: row => row.tel_num,
        },
        {
            name: '',
            selector: (row) => <div><span data-toggle="tooltip" data-placement="top" title="View Product" data-html="true" className="btn-action table-action-view cursor-pointer text-success mg-l-5" data-id={row.customer_id} onClick={() => onUpdate(row.customer_id)}><i className="fa fa-edit"></i></span>
            </div>
        }
    ];
    const paginationComponentOptions = {
        rowsPerPageText: 'Hiển thị',
        rangeSeparatorText: 'tới',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    };
    let [dataSearch, setDataSearch] = useState({
        name: name,
        email: email,
        is_active: is_active,
        address: address
    });

    useEffect(() => {
        CustomerData();
    }, [dataSearch]);

    const CustomerData = () => {
        axios.post("https://cardbey-dev.tech/api/public/api/customer", {
            customer_name: name,
            is_active: is_active,
            email: email,
            address: address
        },
            {
                headers: {
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

    const SubmitCustomer = () => {
        axios.post("https://cardbey-dev.tech/api/public/api/customer/action", {
            action: action,
            id: id,
            customer_name: customer_name,
            tel_num: customer_tel_num,
            address: customer_address,
            is_active: customer_is_active,
            email: customer_email,
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
                window.$('#modalCustomer').modal('hide');
                CustomerData()
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

    const ClearSearch = () => {
        setName('');
        setAddress('');
        setEmail('');
        setIsActive('');
        setDataSearch({
            name: name,
            email: email,
            is_active: is_active,
            address: address
        })
    }

    const ClearModal = () => {
        setCustomerName('');
        setCustomerTelNum('');
        setCustomerAddress('');
        setCustomerEmail('');
        setCustomerIsActive(true);
        clearErrors();
        reset();
    }

    const ShowModalImport = () => {
        window.$('#FormModalImport')[0].reset();
        window.$('#modalImportCustomer #customerImportFile').val('');
        window.$('#modalImportCustomer').modal('show');
    }

    const ExportCustomer = () => {
        fetch("https://cardbey-dev.tech/api/public/api/customer/export", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify({ 
                customer_name: name,
                is_active: is_active,
                email: email,
                address: address
            })
        }).then((res) => {
            return res.blob();
        }).then((blob) => {
            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'CustomerExport_'+Date.now()+'.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error) => {
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
        })
    }

    const ShowModalCustomer = () => {
        ClearModal();
        setAction('create');
        window.$('#modalCustomer .modal-title').html('Thêm Khách hàng');
        window.$('#modalCustomer').modal('show');
    }

    const onUpdate = (customer_id) => {
        ClearModal();
        setAction('update');
        setId(customer_id);
        window.$('#modalCustomer .modal-title').html('Cập nhật khách hàng');
        axios.post("https://cardbey-dev.tech/api/public/api/customer/detail", {
            id: customer_id
        },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        }).then(response => {
            if (response.data.code === 200) {
                setValue('name', response.data.data.customer_name);
                setValue('email', response.data.data.email);
                setCustomerName(response.data.data.customer_name);
                setCustomerTelNum(response.data.data.tel_num);
                setCustomerAddress(response.data.data.address);
                setCustomerEmail(response.data.data.email);
                if(response.data.data.is_active === 1){
                    setCustomerIsActive(true);
                } else {
                    setCustomerIsActive(false);
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
        window.$('#modalCustomer').modal('show');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <ModalImportCustomer customerData={CustomerData}/>
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <form id="FormSearch">
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputName">Tên Khách Hàng</label>
                                        <input type="text" className="form-control" id="InputName" placeholder="Nhập tên sản phẩm" value={name}
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
                                        <label htmlFor="InputIsActive">Trạng thái</label>
                                        <select className="form-control" id="InputIsActive" value={is_active}
                                            onChange={e => setIsActive(e.target.value)}>
                                            <option label="Chọn trạng thái"></option>
                                            <option value="1">Hoạt động</option>
                                            <option value="0">Tạm dừng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputAddress">Địa chỉ</label>
                                        <input type="number" className="form-control" id="InputAddress" placeholder="Nhập địa chỉ" value={address}
                                            onChange={e => setAddress(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success mg-b-5" onClick={ShowModalCustomer} value="Thêm mới"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success mg-b-5" onClick={ShowModalImport} value="ImportCSV"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success mg-b-5" onClick={ExportCustomer}value="ExportCSV"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-primary mg-b-5" onClick={CustomerData} value="Tìm kiếm" />
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-secondary mg-b-5" onClick={ClearSearch} value="Xoá tìm" />
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

            <div className="modal fade" id="modalCustomer">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Thêm khách hàng</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <form id="FormModalCustomer">
                                        <div className="form-group row">
                                                <label htmlFor="inputName" className="col-sm-3 col-form-label">Tên khách hàng</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" id="customer_name" placeholder="Tên khách hàng" required
                                                        value = {customer_name}
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
                                                        onChange={e => setCustomerName(e.target.value)}
                                                    />
                                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                                </div>

                                                <label htmlFor="inputEmail" className="col-sm-3 col-form-label mg-t-10">Email</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="email" placeholder="Email" required
                                                        value = {customer_email}
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
                                                        onChange={e => setCustomerEmail(e.target.value)}
                                                    />
                                                    {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                                </div>

                                                <label htmlFor="inputTelNum" className="col-sm-3 col-form-label mg-t-10">Điện thoại</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="tel_num" placeholder="Số điện thoại" required
                                                        value = {customer_tel_num}
                                                        {...register("phone", {
                                                            pattern: {
                                                                value: /^[0-9]{9,20}$/i,
                                                                message: 'Phone không hợp lệ',
                                                            }
                                                        })}
                                                        onChange={e => setCustomerTelNum(e.target.value)}
                                                    />
                                                    {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                                                </div>

                                                <label htmlFor="inputAddress" className="col-sm-3 col-form-label mg-t-10">Địa chỉ</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="address" placeholder="Địa chỉ" required
                                                        value = {customer_address}
                                                        onChange={e => setCustomerAddress(e.target.value)}
                                                    />
                                                </div>

                                                <label htmlFor="inputIsActive" className="col-sm-3 col-form-label mg-t-10">Trạng Thái</label>
                                                <div className="col-sm-9 mg-t-10">
                                                    <input type="checkbox" id="is_active" onChange={(e) => setCustomerIsActive(e.target.checked)}  defaultChecked={customer_is_active}
                                                    />
                                                </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit(SubmitCustomer)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customer
