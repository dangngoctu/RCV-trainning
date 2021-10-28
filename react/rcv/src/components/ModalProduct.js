import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const ModalProduct = (props) => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors
    } = useForm({
        mode: "onChange" // "onChange"
    });
    const [product_name, setName] = useState('');
    const [is_sales, setIsSales] = useState(1);
    const [product_price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [uploadFile, setUploadFile] = useState();
    let history = useHistory();

    useEffect(() => {
        props.childFunc.current = clearErrors
    }, [])

    const SubmitProduct = () => {
        const dataArray = new FormData();
        dataArray.append("action", props.action);
        dataArray.append("id", props.id);
        dataArray.append("product_name", window.$('#product_name').val());
        dataArray.append("is_sales", window.$('#is_sales').val());
        dataArray.append("product_price", window.$('#product_price').val());
        dataArray.append("description", window.$('#description').val());
        dataArray.append("file", uploadFile);
        axios.post("http://training.uk/api/product/action", dataArray,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Bearer ' + getToken()
                }
            }).then(response => {
                if (response.data.code === 200) {
                    Swal.fire({
                        title: 'Thành công!',
                        text: '',
                        icon: 'success',
                    })
                    window.$('#modalProduct').modal('hide');
                    props.productData()
                } else {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: response.data.msg,
                        icon: 'warning',
                    })
                }
            }).catch(error => {
                if (error.response.status === 401 || error.response.status === 400) {
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
                                    <form id="FormModal">
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <div className="row">
                                                    <label htmlFor="inputName" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                                    <div className="col-sm-10">
                                                        <input type="text" className="form-control" id="product_name" placeholder="Tên sản phẩm" required
                                                            onChange={e => setName(e.target.value)}
                                                            {...register("name", {
                                                                required: 'Tên không được trống!',
                                                                minLength: {
                                                                    value: 5,
                                                                    message: 'Tên phải lớn hơn 5 kí tự.'
                                                                },
                                                                max: {
                                                                    value: 255,
                                                                    message: 'Tên tối đa 255 kí tự!'
                                                                },
                                                            })}
                                                        />
                                                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <label htmlFor="inputPrice" className="col-sm-2 col-form-label mg-t-10">Giá bán</label>
                                                    <div className="col-sm-10">
                                                        <input type="number" step="1" className="form-control mg-t-10" id="product_price" placeholder="Giá sản phẩm" required
                                                            onChange={e => setPrice(e.target.value)}
                                                            {...register("price", {
                                                                required: 'Giá không được trống!',
                                                                min: {
                                                                    value: 0,
                                                                    message: 'Giá không được nhỏ hơn 0'
                                                                }
                                                            })}
                                                        />
                                                         {errors.price && <p className="text-danger">{errors.price.message}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <label htmlFor="inputDescription" className="col-sm-2 col-form-label mg-t-10">Mô tả</label>
                                            <div className="col-sm-10">
                                                <textarea rows="4" className="form-control mg-t-10" id="description" placeholder="Mô tả sản phẩm"
                                                    onChange={e => setDescription(e.target.value)}
                                                />
                                            </div>
                                            <label htmlFor="inputIsSales" className="col-sm-2 col-form-label mg-t-10">Trạng thái</label>
                                            <div className="col-sm-10">
                                                <select className="form-control mg-t-10" id="is_sales"
                                                    onChange={e => setIsSales(e.target.value)}
                                                >
                                                    <option value="1">Đang bán</option>
                                                    <option value="2">Đang hết hàng</option>
                                                    <option value="0">Ngừng bán</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="row">
                                        <div className="col-12 col-md-12">
                                            <input type="file" id="product_image_file" onChange={(e) => setUploadFile(e.target.files[0])} accept="image/jpg, image/jpeg, image/png" />
                                        </div>
                                        <div className="col-12 col-md-12  mg-t-10">
                                            <img className="w-100" src='' id="product_image"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit(SubmitProduct)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalProduct
