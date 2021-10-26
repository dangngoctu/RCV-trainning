import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import ModalImportCustomer from './ModalImportCustomer';
import ModalCustomer from './ModalCustomer';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { timers } from 'jquery';


const Customer = () => {

    let [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [is_active, setIsActive] = useState('');
    const [action, setAction] = useState('create');
    const [id, setId] = useState('');
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
    const FileDownload = require('js-file-download');

    useEffect(() => {
        CustomerData();
    }, []);

    const CustomerData = () => {
        axios.post("http://training.uk/api/customer", {
            customer_name: window.$('#FormSearch #InputName').val(),
            is_active: window.$('#FormSearch #InputIsActive').val(),
            email: window.$('#FormSearch #InputEmail').val(),
            address: window.$('#FormSearch #InputAddress').val()
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
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                    icon: 'error',
                })
            });
    }

    const ClearSearch = () => {
        window.$('#FormSearch')[0].reset();
        CustomerData();
    }

    const ClearModal = () => {
        window.$('#FormModalCustomer')[0].reset();
    }

    const ShowModalImport = () => {
        window.$('#FormModalImport')[0].reset();
        window.$('#modalImportCustomer #customerImportFile').val('');
        window.$('#modalImportCustomer').modal('show');
    }

    const ExportCustomer = () => {
        fetch("http://training.uk/api/customer/export", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify({ 
                customer_name: window.$('#FormSearch #InputName').val(),
                is_active: window.$('#FormSearch #InputIsActive').val(),
                email: window.$('#FormSearch #InputEmail').val(),
                address: window.$('#FormSearch #InputAddress').val() 
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
        }).catch((err) => {
            return Promise.reject({ Error: 'Something Went Wrong', err });
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
        axios.post("http://training.uk/api/customer/detail", {
            id: customer_id
        },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        }).then(response => {
            if (response.data.code === 200) {
                window.$('#customer_name').val(response.data.data.customer_name);
                window.$('#tel_num').val(response.data.data.tel_num);
                window.$('#address').val(response.data.data.address);
                window.$('#email').val(response.data.data.email);
                if(response.data.data.is_active == 1){
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
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                icon: 'error',
            })
        });
        window.$('#modalCustomer').modal('show');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <ModalImportCustomer customerData={CustomerData} />
            <ModalCustomer customerData={CustomerData} action={action} id={id}/>
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <form id="FormSearch">
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputName">Tên Khách Hàng</label>
                                        <input type="text" className="form-control" id="InputName" placeholder="Nhập tên sản phẩm"
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
                                        <label htmlFor="InputIsActive">Trạng thái</label>
                                        <select className="form-control" id="InputIsActive"
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
                                        <input type="number" className="form-control" id="InputAddress" placeholder="Nhập địa chỉ"
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success" onClick={ShowModalCustomer} value="Thêm mới"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success" onClick={ShowModalImport} value="ImportCSV"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success" onClick={ExportCustomer}value="ExportCSV"/>
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-primary" onClick={CustomerData} value="Tìm kiếm" />
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-secondary" onClick={ClearSearch} value="Xoá tìm" />
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

export default Customer
