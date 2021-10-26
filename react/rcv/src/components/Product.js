import React, { useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/Common';
import Header from './Header';
import Navbar from './Navbar';
import ModalProduct from './ModalProduct';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';

const Product = () => {

    const [action, setAction] = useState('create');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [is_sales, setIsSales] = useState('');
    const [price_from, setPriceFrom] = useState('');
    const [price_to, setPriceTo] = useState('');
    let [data, setData] = useState([]);

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
    }, []);

    const ProductData = () => {
        axios.post("http://training.uk/api/product", {
            name: window.$('#FormSearch #InputName').val(),
            is_sales: window.$('#FormSearch #InputIsSale').val(),
            price_from: window.$('#FormSearch #InputPriceFrom').val(),
            price_to: window.$('#FormSearch #InputPriceTo').val()
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
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                icon: 'error',
            })
        });
    }

    const ClearSearch = () => {
        window.$('#FormSearch')[0].reset();
        ProductData();
    }

    const ClearModal = () => {
        window.$('#FormModal')[0].reset();
        window.$('#product_image_file').val('');
        window.$('#product_image').prop('src', '');
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
                window.$('#product_name').val(response.data.data.product_name);
                window.$('#product_price').val(response.data.data.product_price);
                window.$('#description').val(response.data.data.description);
                window.$('#is_sales').val(response.data.data.is_sales).trigger('change');
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
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                icon: 'error',
            })
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
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                        icon: 'error',
                    })
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
            <ModalProduct action={action} id={id} productData={ProductData} />
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
                                <input type="button" className="btn btn-block btn-success" value="Thêm mới" onClick={CreateModal} />
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ProductData} className="btn btn-block btn-primary" value="Tìm kiếm" />
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ClearSearch} className="btn btn-block btn-secondary" value="Xoá tìm" />
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

export default Product
