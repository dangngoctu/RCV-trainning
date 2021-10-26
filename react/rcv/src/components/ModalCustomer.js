import React, { useState } from 'react';
import { removeToken, getToken } from '../utils/Common';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModalCustomer = (props) => {
    const [customer_name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel_num, setTelNum] = useState('');
    const [address, setAddress] = useState('');
    const [is_active, setIsActive] = useState('');

    const SubmitCustomer = () => {
        axios.post("http://training.uk/api/customer/action", {
            action: props.action,
            id: props.id,
            customer_name: window.$('#customer_name').val(),
            tel_num: window.$('#tel_num').val(),
            address: window.$('#address').val(),
            is_active: window.$('#is_active').val(),
            email: window.$('#email').val(),
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
                props.customerData()
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
                                                        onChange={e => setName(e.target.value)}
                                                    />
                                                </div>

                                                <label htmlFor="inputEmail" className="col-sm-3 col-form-label mg-t-10">Email</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="email" placeholder="Email" required
                                                        onChange={e => setEmail(e.target.value)}
                                                    />
                                                </div>

                                                <label htmlFor="inputTelNum" className="col-sm-3 col-form-label mg-t-10">Điện thoại</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="tel_num" placeholder="Số điện thoại" required
                                                        onChange={e => setTelNum(e.target.value)}
                                                    />
                                                </div>

                                                <label htmlFor="inputAddress" className="col-sm-3 col-form-label mg-t-10">Địa chỉ</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control mg-t-10" id="address" placeholder="Địa chỉ" required
                                                        onChange={e => setAddress(e.target.value)}
                                                    />
                                                </div>

                                                <label htmlFor="inputIsActive" className="col-sm-3 col-form-label mg-t-10">Trạng Thái</label>
                                                <div className="col-sm-9 mg-t-10">
                                                    <input type="checkbox" id="is_active" required
                                                        onChange = {e => setIsActive(e.target.checked)}/>
                                                </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={SubmitCustomer}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalCustomer