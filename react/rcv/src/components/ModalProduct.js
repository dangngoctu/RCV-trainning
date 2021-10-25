import React, { useState } from 'react';
import { removeToken, getToken } from '../utils/Common';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery'; 

const ModalProduct = (props) => {
    const [product_name, setName] = useState('');
    const [is_sales, setIsSales] = useState(1);
    const [product_price, setPrice] = useState('');
    const [description, setDescription] = useState('');


    const SubmitProduct = () => {
        axios.post("http://training.uk/api/product/action", {
            action: props.action,
            id: props.id,
            product_name: product_name,
            is_sales: is_sales,
            product_price: product_price,
            description: description
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.data.code === 200) {
                window.$('#modalProduct').modal('hide');
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
            <div className="modal fade" id="modalProduct">
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
                                <div className="col-12 col-md-8">
                                    <div className="form-group row">
                                        <label htmlFor="inputName" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="product_name" placeholder="Tên sản phẩm" required 
                                                onChange={e => setName(e.target.value)}
                                            />
                                        </div>
                                        <label htmlFor="inputPrice" className="col-sm-2 col-form-label mg-t-10">Giá bán</label>
                                        <div className="col-sm-10">
                                            <input type="number" step="1" className="form-control mg-t-10" id="product_price" placeholder="Giá sản phẩm" required 
                                                onChange={e => setPrice(e.target.value)}
                                            />
                                        </div>
                                        <label htmlFor="inputDescription" className="col-sm-2 col-form-label mg-t-10">Mô tả</label>
                                        <div className="col-sm-10">
                                            <textarea rows="4" className="form-control mg-t-10" id="description" placeholder="Mô tả sản phẩm" 
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <label htmlFor="inputIsSales" className="col-sm-2 col-form-label mg-t-10">Trạng thái</label>
                                        <div className="col-sm-10">
                                        <select  className="form-control mg-t-10" id="is_sales"
                                            onChange={e => setIsSales(e.target.value)}
                                        >
                                            <option value="1">Đang bán</option>
                                            <option value="2">Đang hết hàng</option>
                                            <option value="0">Ngừng bán</option>
                                        </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    abc
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={SubmitProduct}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalProduct