import React, { useState } from 'react';
import { removeToken, getToken } from '../utils/Common';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const ModalImportCustomer = (props) => {

    let history = useHistory();
    const [uploadFile, setUploadFile] = useState();
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm({
        mode: "onChange"
    });
    const ImportCustomer = () => {
        const dataArray = new FormData();
        dataArray.append("import_file", uploadFile);
        axios.post("http://training.uk/api/customer/import", dataArray,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.data.code === 200) {
                Swal.fire({
                    title: 'Thành công!',
                    text: response.data.msg,
                    icon: 'success',
                })
                props.customerData();
                window.$('#modalImportCustomer').modal('hide');
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
    return (
        <div>
            <div className="modal fade" id="modalImportCustomer">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Import khách hàng</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-md-8">
                                    <form id="FormModalImport">
                                        <div className="col-12 col-md-12">
                                            <input type="file" id="customerImportFile" onChange={(e) => setUploadFile(e.target.files[0])} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                {...register("file_import", {
                                                    required: 'File import không được trống!'
                                                })}
                                            />
                                            {errors.file_import && <p className="text-danger">{errors.file_import.message}</p>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between mg-t-10">
                                <button type="button" className="btn btn-default" data-dismiss="modal" >Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit(ImportCustomer)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalImportCustomer
