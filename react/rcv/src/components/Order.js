import React from 'react';
import DataTable from 'react-data-table-component';
import Header from './Header';
import Navbar from './Navbar';

const Order = () => {
    const paginationComponentOptions = {
        rowsPerPageText: 'Hiển thị',
        rangeSeparatorText: 'tới',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    };
    const columns = [
        {
            name: '#',
            selector: row => row.order_id,
            sortable: true,
        },
        {
            name: 'Tên cửa hàng',
            selector: row => row.order_shop,
            sortable: true,
        },
        {
            name: 'Tên khách hàng',
            selector: row => row.customer,
        },
        {
            name: 'Tổng tiền',
            selector: row => row.total_price,
        },
        {
            name: 'Loại thanh toán',
            selector: row => row.payment_method,
        },
        {
            name: 'Trạng thái đơn',
            selector: row => row.order_status,
        },
        {
            name: 'Trạng thái vận chuyển',
            selector: row => row.shipment_status,
        },
        {
            name: 'Ngày tạo đơn',
            selector: row => row.order_date,
        },
        {
            name: '',
            selector: row => <div><span data-toggle="tooltip" data-placement="top" title="View Product" data-html="true" className="btn-action table-action-view cursor-pointer text-success mg-l-5"><i className="fa fa-edit"></i></span>
            </div>
        }
    ];

    const data = [
        {
            order_id: 1,
            order_shop: 'Amazon',
            customer: 'Nguyễn A',
            total_price: '1040000',
            payment_method: 'COD',
            shipment_status: '',
            order_status: 'Mới tạo',
            order_date: '27/10/2021'
        }, {
            order_id: 2,
            order_shop: 'Yahoo',
            customer: 'Nguyễn B',
            total_price: '1500000',
            payment_method: 'PayPal',
            shipment_status: '',
            order_status: 'Mới tạo',
            order_date: '26/10/2021'
        }, {
            order_id: 3,
            order_shop: 'Amazon',
            customer: 'Nguyễn C',
            total_price: '2100000',
            payment_method: 'GMO',
            shipment_status: 'Đang giao tới',
            order_status: 'Đang vận chuyển',
            order_date: '26/10/2021'
        }, {
            order_id: 4,
            order_shop: 'Rakuten',
            customer: 'Nguyễn D',
            total_price: '100060',
            payment_method: 'COD',
            shipment_status: '',
            order_status: 'Mới tạo',
            order_date: '27/10/2021'
        }, {
            order_id: 5,
            order_shop: 'Yahoo',
            customer: 'Nguyễn E',
            total_price: '100005',
            payment_method: 'PayPal',
            shipment_status: '',
            order_status: 'Mới tạo',
            order_date: '26/10/2021'
        }, {
            order_id: 6,
            order_shop: 'Amazon',
            customer: 'Nguyễn F',
            total_price: '100002',
            payment_method: 'Rakuten',
            shipment_status: 'Không nhận hàng',
            order_status: 'Trả hàng',
            order_date: '26/10/2021'
        }, {
            order_id: 7,
            order_shop: 'Rakuten',
            customer: 'Nguyễn D',
            total_price: '100000',
            payment_method: 'COD',
            shipment_status: 'Đang ở kho B',
            order_status: 'Đang vận chuyển',
            order_date: '27/10/2021'
        }, {
            order_id: 8,
            order_shop: 'Yahoo',
            customer: 'Nguyễn E',
            total_price: '100002',
            payment_method: 'PayPal',
            shipment_status: 'Đang ở kho A',
            order_status: 'Đang vận chuyển',
            order_date: '26/10/2021'
        }, {
            order_id: 9,
            order_shop: 'Amazon',
            customer: 'Nguyễn F',
            total_price: '100001',
            payment_method: 'Rakuten',
            shipment_status: 'Hoàn thành',
            order_status: 'Hoàn thành',
            order_date: '26/10/2021'
        }
    ];

    const columns_order = [
        {
            name: '#',
            selector: row => row.order_id,
            sortable: true,
        },
        {
            name: 'Sản phẩm',
            selector: row => row.product,
            sortable: true,
        },
        {
            name: 'shop',
            selector: row => row.shop,
        },
        {
            name: 'Giá tiền',
            selector: row => row.price,
        },
        {
            name: 'Số lượng',
            selector: row => row.quantity,
        },
        {
            name: 'total_price',
            selector: row => row.total_price,
        },
        {
            name: '',
            selector: row => <div><span data-toggle="tooltip" data-placement="top" title="View Product" data-html="true" className="btn-action table-action-view cursor-pointer text-success mg-l-5"><i className="fa fa-edit"></i></span>
            </div>
        }
    ];

    const data_order = [
        {
            order_id: 1,
            product: 'Sản Phẩm A',
            price: 100,
            quantity: 1,
            total_price: 100,
            shop: 'Amazon'
        }
    ];

    const OnCreate = () => {
        window.$('#modalOrder').modal('show');
    }

    return (
        <div>
            <Header />
            <Navbar />
            <div className="content-wrapper">
                <div className='pd-15'>
                    <div className="filter mg-b-10">
                        <div className="row">
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="InputName">Tên cửa hàng</label>
                                    <input type="text" className="form-control" id="InputName" placeholder="Nhập tên cửa hàng" />
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="InputIsActive">Loại thanh toán</label>
                                    <select className="form-control" id="InputIsActive">
                                        <option label="Chọn loại thanh toán"></option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="InputIsActive">Trạng thái đơn</label>
                                    <select className="form-control" id="InputIsActive">
                                        <option label="Chọn loại thanh toán"></option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="InputIsActive">Vận chuyển</label>
                                    <select className="form-control" id="InputIsActive">
                                        <option label="Chọn loại thanh toán"></option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="InputName">Thời gian tạo đơn</label>
                                    <input type="date" className="form-control" id="InputDate" placeholder="Nhập tên cửa hàng" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success mg-b-5" value="Thêm mới" onClick={OnCreate} />
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-success mg-b-5" value="ExportCSV" />
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-primary mg-b-5" value="Tìm kiếm" />
                            </div>
                            <div className="col-12 col-md-2">
                                <input type="button" className="btn btn-block btn-secondary mg-b-5" value="Xoá tìm" />
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

            <div className="modal fade" id="modalOrder">
                <div className="modal-dialog modal-xxl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Chi tiết đơn hàng</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-md-12">
                                    <form id="FormModal">
                                        <div className="form-group row">
                                            <div className="col-12 col-sm-6">
                                                <div className="row">
                                                    <label htmlFor="inputNameShop" className="col-sm-2 col-form-label">Tên shop</label>
                                                    <div className="col-sm-10">
                                                        <select className="form-control" id="shop_id">
                                                            <option label="Chọn shop"></option>
                                                            <option value="1">Admin</option>
                                                            <option value="2">Editer</option>
                                                            <option value="2">Reviewer</option>
                                                        </select>
                                                    </div>
                                                    <label htmlFor="inputTax" className="col-sm-2 col-form-label mg-t-10">Tax</label>
                                                    <div className="col-sm-10">
                                                        <input type="text" className="form-control mg-t-10" id="tax" placeholder="Tax"
                                                        />
                                                    </div>
                                                    <label htmlFor="inputTax" className="col-sm-2 col-form-label mg-t-10">Phí vận chuyển</label>
                                                    <div className="col-sm-10">
                                                        <input type="text" className="form-control mg-t-10" id="ship_charge" placeholder="Phí vận chuyển"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="row">
                                                    <label htmlFor="inputCustomer" className="col-sm-2 col-form-label">Khách hàng</label>
                                                    <div className="col-sm-10">
                                                        <select className="form-control" id="customer_id">
                                                            <option label="Chọn khách hàng"></option>
                                                            <option value="1">Admin</option>
                                                            <option value="2">Editer</option>
                                                            <option value="2">Reviewer</option>
                                                        </select>
                                                    </div>
                                                    <label htmlFor="inputPaymentMethod" className="col-sm-2 col-form-label mg-t-10">Thanh toán</label>
                                                    <div className="col-sm-10">
                                                        <select className="form-control mg-t-10" id="payment_method">
                                                            <option label="Chọn phương thức thanh toán"></option>
                                                            <option value="1">Admin</option>
                                                            <option value="2">Editer</option>
                                                            <option value="2">Reviewer</option>
                                                        </select>
                                                    </div>
                                                    <label htmlFor="inputOrderStatus" className="col-sm-2 col-form-label mg-t-10">Trạng thái đơn hàng</label>
                                                    <div className="col-sm-4">
                                                        <select className="form-control mg-t-10" id="orderr">
                                                            <option label="Chọn phương thức thanh toán"></option>
                                                            <option value="1">Admin</option>
                                                            <option value="2">Editer</option>
                                                            <option value="2">Reviewer</option>
                                                        </select>
                                                    </div>

                                                    <label htmlFor="inputPaymentStatus" className="col-sm-2 col-form-label mg-t-10">Trạng thái giao hàng</label>
                                                    <div className="col-sm-4">
                                                        <select className="form-control mg-t-10" id="payment_method">
                                                            <option label="Chọn phương thức thanh toán"></option>
                                                            <option value="1">Admin</option>
                                                            <option value="2">Editer</option>
                                                            <option value="2">Reviewer</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <label htmlFor="inputTax" className="col-sm-1 col-form-label mg-t-10">Ghi chú</label>
                                            <div className="col-sm-11">
                                                <textarea type="text" rows="4" className="form-control mg-t-10" id="note_order" placeholder="Ghi chú cho đơn hàng"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-2" tyle={{ float: "right" }}>
                                            <input type="button" className="btn btn-block btn-success" value="Thêm mới" onClick={OnCreate} />
                                        </div>

                                        <div className="datatable">
                                            <DataTable
                                                columns={columns_order}
                                                data={data_order}
                                                pagination
                                                paginationComponentOptions={paginationComponentOptions}
                                                responsive
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Order
