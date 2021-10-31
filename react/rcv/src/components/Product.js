import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const Product = () => {

    const [action, setAction] = useState('create');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [is_sales, setIsSales] = useState('');
    const [price_from, setPriceFrom] = useState('');
    const [price_to, setPriceTo] = useState('');
    const [product_name, setProductName] = useState('');
    const [product_is_sales, setProductIsSales] = useState(1);
    const [product_price, setProductPrice] = useState('');
    const [description, setProductDescription] = useState('');
    const [uploadFile, setUploadFile] = useState();
    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors,
        reset
    } = useForm({
        mode: "onChange" // "onChange"
    });

    let [data, setData] = useState([]);
    let [dataSearch, setDataSearch] = useState({
        name: name,
        is_sales: is_sales,
        price_from: price_from,
        price_to: price_to
    });

    let history = useHistory();

    const columns = [
        {
            name: '#',
            selector: row => row.product_id,
            sortable: true,
        },
        {
            name: 'Tên sản phẩm',
            selector: row => row.product_name,
            sortable: true,
        },
        {
            name: 'Mô tả',
            selector: row => row.description,
        },
        {
            name: 'Giá',
            selector: row => '$' + row.product_price,
            sortable: true
        },
        {
            name: 'Tình trạng',
            selector: row => row.is_sales_show,
        },
        {
            name: '',
            selector: (row) => <div><span data-toggle="tooltip" data-placement="top" title="View Product" data-html="true" className="btn-action table-action-view cursor-pointer text-success mg-l-5" onClick={() => onUpdate(row.product_id)} data-id={row.product_id}><i className="fa fa-edit"></i></span>
                <span data-toggle="tooltip" data-placement="top" title="Delete Product" data-html="true" className="btn-action table-action-delete cursor-pointer text-danger mg-l-5" onClick={() => onDelete(row.product_id)} data-id={row.product_id}><i className="fa fa-trash"></i></span>
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
        ProductData();
    }, [dataSearch]);

    const ProductData = () => {
        axios.post("http://training.uk/api/product", {
            name: name,
            is_sales: is_sales,
            price_from: price_from,
            price_to: price_to
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.data.code === 200) {
                setData([...response.data.data.data]);
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

    const SubmitProduct = () => {
        const dataArray = new FormData();
        dataArray.append("action", action);
        dataArray.append("id", id);
        dataArray.append("product_name", product_name);
        dataArray.append("is_sales", product_is_sales);
        dataArray.append("product_price", product_price);
        dataArray.append("description", description);
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
                    ProductData()
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

    const ClearSearch = () => {
        window.$('#FormSearch')[0].reset();
        setName('');
        setIsSales('');
        setPriceFrom('');
        setPriceTo('');
        setDataSearch({
            name: name,
            is_sales: is_sales,
            price_from: price_from,
            price_to: price_to
        });
    }

    const ClearModal = () => {
        window.$('#FormModal')[0].reset();
        window.$('#product_image_file').val('');
        window.$('#product_image').prop('src', '');
        setProductName('');
        setProductIsSales('');
        setProductPrice('');
        setProductDescription('');
        setUploadFile();
        clearErrors();
        reset();
    }

    let onUpdate = (product_id) => {
        ClearModal();
        setId(product_id);
        window.$('#modalProduct .modal-title').html('Cập nhật sản phẩm');
        setAction('update');
        axios.post("http://training.uk/api/product/detail", {
            id: product_id
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
        }).then(response => {
            if (response.data.code === 200) {
                setProductName(response.data.data.product_name);
                setProductIsSales(response.data.data.is_sales);
                setProductPrice(response.data.data.product_price);
                setProductDescription(response.data.data.description);
                if(response.data.data.product_image){
                    window.$('#product_image').prop('src', 'http://training.uk/img/product/'+response.data.data.product_image);
                } else {
                    window.$('#product_image').prop('src', '');
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
        window.$('#modalProduct').modal('show');
    }

    let onDelete = (product_id) => {
        Swal.fire({
            title: 'Bạn có muốn xoá sản phẩm này?',
            text: "Bạn sẽ không thể hoàn lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Huỷ'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post("http://training.uk/api/product/action", {
                    action: 'delete',
                    id: product_id,
                },
                {
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
                        ProductData();
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

    let CreateModal = () => {
        ClearModal();
        setAction('create');
        window.$('#modalProduct .modal-title').html('Thêm sản phẩm');
        window.$('#modalProduct').modal('show');
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
                                        <label htmlFor="InputName">Tên sản phẩm</label>
                                        <input type="text" className="form-control" id="InputName" placeholder="Nhập tên sản phẩm"
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputIsSale">Trạng thái</label>
                                        <select className="form-control" id="InputIsSale"
                                            onChange={e => setIsSales(e.target.value)}>
                                            <option label="Chọn trạng thái"></option>
                                            <option value="1">Đang bán</option>
                                            <option value="2">Đang hết hàng</option>
                                            <option value="0">Ngừng bán</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputPriceFrom">Giá bán từ</label>
                                        <input type="number" className="form-control" id="InputPriceFrom" placeholder="Nhập giá bán tới"
                                            onChange={e => setPriceFrom(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="InputPriceTo">Giá bán tới</label>
                                        <input type="number" className="form-control" id="InputPriceTo" placeholder="Nhập giá bán từ"
                                            onChange={e => setPriceTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-12 col-md-3">
                                <input type="button" className="btn btn-block btn-success mg-b-5" value="Thêm mới" onClick={CreateModal} />
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ProductData} className="mg-b-5 btn btn-block btn-primary" value="Tìm kiếm" />
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
                                                        <input type="text" className="form-control" id="product_name" placeholder="Tên sản phẩm" required value={product_name}
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
                                                            onChange={e => setProductName(e.target.value)}
                                                        />
                                                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <label htmlFor="inputPrice" className="col-sm-2 col-form-label mg-t-10">Giá bán</label>
                                                    <div className="col-sm-10">
                                                        <input type="number" step="1" className="form-control mg-t-10" id="product_price" placeholder="Giá sản phẩm" value={product_price} required
                                                            {...register("price", {
                                                                required: 'Giá không được trống!',
                                                                min: {
                                                                    value: 0,
                                                                    message: 'Giá không được nhỏ hơn 0'
                                                                },
                                                                max: {
                                                                    value: 999999,
                                                                    message: 'Giá không được lớn hơn 999999'
                                                                }
                                                            })}
                                                            onChange={e => setProductPrice(e.target.value)}
                                                        />
                                                         {errors.price && <p className="text-danger">{errors.price.message}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <label htmlFor="inputDescription" className="col-sm-2 col-form-label mg-t-10">Mô tả</label>
                                            <div className="col-sm-10">
                                                <textarea rows="4" className="form-control mg-t-10" id="description" placeholder="Mô tả sản phẩm" value={description}
                                                    onChange={e => setProductDescription(e.target.value)}
                                                />
                                            </div>
                                            <label htmlFor="inputIsSales" className="col-sm-2 col-form-label mg-t-10">Trạng thái</label>
                                            <div className="col-sm-10">
                                                <select className="form-control mg-t-10" id="is_sales" value={product_is_sales}
                                                    onChange={e => setProductIsSales(e.target.value)}
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

export default Product
