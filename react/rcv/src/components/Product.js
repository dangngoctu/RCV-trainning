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
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng liên hệ quản trị viên để được hỗ trợ!',
                icon: 'error',
            })
        });
    } 

    let onUpdate = (product_id) => {
        setId(product_id);
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

    const onDelete = (e) => {
        setId(window.$(this).data('id'));
        setAction('delete');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <ModalProduct action={action} id={id}/>
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label for="InputName">Tên sản phẩm</label>
                                    <input type="text" className="form-control" id="InputName" placeholder="Nhập tên sản phẩm"
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label for="InputIsSale">Trạng thái</label>
                                    <select className="form-control" id="InputIsSale"
                                        onChange={e => setIsSales(e.target.value)}
                                    >
                                        <option label="Chọn trạng thái"></option>
                                        <option value="1">Đang bán</option>
                                        <option value="2">Đang hết hàng</option>
                                        <option value="0">Ngừng bán</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label for="InputPriceFrom">Giá bán từ</label>
                                    <input type="number" className="form-control" id="InputPriceFrom" placeholder="Nhập giá bán tới"
                                        onChange={e => setPriceFrom(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="form-group">
                                    <label for="InputPriceTo">Giá bán tới</label>
                                    <input type="number" className="form-control" id="InputPriceTo" placeholder="Nhập giá bán từ"
                                        onChange={e => setPriceTo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <input type="button" className="btn btn-block btn-success" value="Thêm mới" data-toggle="modal" data-target="#modalProduct"/>
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ProductData} className="btn btn-block btn-primary" value="Tìm kiếm"/>
                            </div>
                            <div className="col-12 col-md-3">
                                <input type="button" onClick={ProductData} className="btn btn-block btn-secondary" value="Xoá tìm"/>
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
