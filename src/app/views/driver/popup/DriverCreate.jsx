import React, { Component } from "react";
import Modal from '@material-ui/core/Modal';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { Button } from '@material-ui/core';
import styled from "@emotion/styled";
import { addDriver, getListDriverLicenseType, getListDriver } from "src/features/driverSlice";
import { connect } from "react-redux";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { VALIDATE } from "src/app/constant/config";

class DriverCreate extends Component {
    constructor(props) {
        super(props);
        const { driverSlice, getListDriverLicenseType } = this.props;
        getListDriverLicenseType();
        this.state = {
            selectGender: "",
            selectLicenseType: "",
            error: {}
        }
        console.log(driverSlice);


    }
    handleAddDriver() {
        const { addDriver } = this.props;
        const regexPhoneNumber = VALIDATE.PHONE;
        const regexCMMD = VALIDATE.PEOPLE_ID;
        if (this.dataInput.name.length < 1) {
            this.setState({ error: { name: true } });
            return false;
        }
        if (this.dataInput.date_of_birth.length < 3) {
            this.setState({ error: { date_of_birth: true } });
            return false;
        }
        if (!regexCMMD.test(this.dataInput.cmnd)) {
            this.setState({ error: { cmnd: true } });
            return false;
        }
        if (!regexPhoneNumber.test(this.dataInput.phone)) {
            this.setState({ error: { phone: true } });
            return false;
        }
        if (this.state.selectGender.length < 3) {
            this.setState({ error: { selectGender: true } });
            return false;
        }
        if (this.state.selectLicenseType.length < 1) {
            this.setState({ error: { selectLicenseType: true } });
            return false;
        }
        if (this.dataInput.license_number.length < 10) {
            this.setState({ error: { license_number: true } });
            return false;
        }
        if (this.dataInput.address.length < 3) {
            this.setState({ error: { address: true } });
            return false;
        }
        if (this.dataInput.license_expire_date.length < 3) {
            this.setState({ error: { license_expire_date: true } });
            return false;
        }
        addDriver(
            {
                name: this.dataInput.name,
                date_of_birth: this.dataInput.date_of_birth,
                cmnd: this.dataInput.cmnd,
                phone: this.dataInput.phone,
                gender: this.state.selectGender,
                license_type: this.state.selectLicenseType,
                license_number: this.dataInput.license_number,
                address: this.dataInput.address,
                license_expire_date: this.dataInput.license_expire_date,
                license_issue_date: this.dataInput.license_issue_date
            });
        this.props.close();
        this.props.success();
    }

    dataInput = {
        name: "",
        date_of_birth: "",
        cmnd: "",
        phone: "",
        license_number: "",
        address: "",
        license_expire_date: "",
        license_issue_date: ""
    };
    resetError() {
        this.setState({ error: {} })
    }
    render() {
        const { driverSlice } = this.props;
        return (
            <Modal
                open={this.props.show}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <div style={{ width: "784px", backgroundColor: "#FFFFFF", borderRadius: "8px", paddingLeft: "32px", paddingRight: "32px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", marginTop: "24px" }}>
                            <div style={{ color: "#C62222", fontSize: "18px", fontFamily: "iCiel Helvetica Now Display", fontWeight: "bold", }}>Thêm tài xế</div>
                            <Button onClick={() => this.props.close()} >
                                <CloseOutlinedIcon />
                            </Button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <WrapInput>
                                <div className={"titleInput"}>Họ tên</div>
                                <input onChange={(e) => { this.dataInput.name = e.target.value; this.resetError() }} placeholder={"Họ tên lái xe"} className={"input"} />
                                {this.state.error.name && <div className={"error"}>Họ tên không hợp lệ</div>}
                            </WrapInput>

                            <WrapInput>
                                <div className={"titleInput"}>Ngày sinh</div>
                                <TextField
                                    id="date"
                                    type="date"
                                    defaultValue=""
                                    className={"input"}
                                    onChange={(e) => { this.dataInput.date_of_birth = moment(e.target.value).format("MM/DD/YYYY"); this.resetError() }}
                                />
                                {this.state.error.date_of_birth && <div className={"error"}>Vui lòng chọn ngày sinh</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>CMTND/CCCD</div>
                                <input onChange={(e) => { this.dataInput.cmnd = e.target.value; this.resetError() }} placeholder={"CMTND hoặc CCCD"} className={"input"} />
                                {this.state.error.cmnd && <div className={"error"}>CMTND/CCCD không hợp lệ</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Số điện thoại</div>
                                <input onChange={(e) => { this.resetError(); this.dataInput.phone = e.target.value }} placeholder={"Số điện thoại"} className={"input"} />
                                {this.state.error.phone && <div className={"error"}>Số điện thoại không hợp lệ</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Giới tính</div>
                                <Select
                                    onChange={(e) => { this.setState({ selectGender: e.target.value }); this.resetError() }}
                                    className={"input"}
                                    value={this.state.selectGender}
                                >
                                    <MenuItem value={"male"}>Nam</MenuItem>
                                    <MenuItem value={"female"}>Nữ</MenuItem>
                                </Select>
                                {this.state.error.selectGender && <div className={"error"}>Vui lòng chọn giới tính</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Kiểu bằng lái</div>
                                <Select onChange={(e) => { this.setState({ selectLicenseType: e.target.value }); this.resetError() }} className={"input"} value={this.state.selectLicenseType} >
                                    {
                                        driverSlice.listDriverLicenseType && driverSlice.listDriverLicenseType.payload.driver_license_type.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                {this.state.error.selectLicenseType && <div className={"error"}>Vui lòng chọn loại bằng lái</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Số giấy phép lái xe</div>
                                <input onChange={(e) => { this.dataInput.license_number = e.target.value; this.resetError() }} placeholder={"Giấy phép lái xe số"} className={"input"} />
                                {this.state.error.license_number && <div className={"error"}>Vui lòng nhập số giấy phép lái xe</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Địa chỉ</div>
                                <input onChange={(e) => { this.dataInput.address = e.target.value; this.resetError() }} placeholder={"Địa chỉ"} className={"input"} />
                                {this.state.error.address && <div className={"error"}>Vui lòng nhập địa chỉ</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Ngày cấp bằng lái</div>
                                <TextField
                                    format="DD/MM/yyyy"
                                    id="date"
                                    type="date"
                                    defaultValue=""
                                    className={"input"}
                                    onChange={(e) => { this.dataInput.license_expire_date = moment(e.target.value).format("MM/DD/YYYY"); this.resetError() }}
                                />
                                {this.state.error.license_expire_date && <div className={"error"}>Vui lòng chọn ngày</div>}
                            </WrapInput>
                            <WrapInput>
                                <div className={"titleInput"}>Ngày hết hạn bằng lái</div>
                                <TextField
                                    id="date"
                                    type="date"
                                    defaultValue=""
                                    className={"input"}
                                    onChange={(e) => { this.dataInput.license_issue_date = moment(e.target.value).format("MM/DD/YYYY"); this.resetError() }}
                                />
                            </WrapInput>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "28px", marginBottom: "32px" }}>
                            <Button
                                style={{ border: "1px solid #C62222", borderRadius: "4px", height: "48px", width: "185px", marginRight: "8px" }}
                                color="primary"
                                onClick={() => this.props.close()}
                            >Thoát</Button>
                            <Button
                                style={{ color: "#FFFFFF", backgroundColor: "#AE0000", borderRadius: "4px", height: "48px", width: "185px", marginLeft: "8px" }}
                                onClick={() => this.handleAddDriver()}>
                                Thêm mới
                            </Button>
                        </div>
                    </div>

                </div>

            </Modal>

        )
    }
}
const mapStateToProps = (state) => {
    return { driverSlice: state.driverSlice }
}
const mapDispatchToProps = () => {
    return {
        addDriver,
        getListDriverLicenseType,
        getListDriver
    }
}
export default connect(mapStateToProps, mapDispatchToProps())(DriverCreate);

const WrapInput = styled.div`
    .titleInput{
        font-family: iCiel Helvetica Now Display;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #858C93;
        margin-top: 12px;
        margin-bottom: 12px;
        
    }
    .input {
        background: #FFFFFF;
        border: 1px solid #E5E5E8;
        box-sizing: border-box;
        border-radius: 4px;
        width: 352px;
        height: 40px;
        padding: 12px 14px;
    }
    .error{
        color:#F54B24;
        font-size:11px;
    }
`
