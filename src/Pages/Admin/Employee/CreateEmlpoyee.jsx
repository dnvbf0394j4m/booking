import { Form, Input, Button, Select, Row, Col, DatePicker, Radio } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function CreateEmployee({ onSuccess, onCancel }) {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
        // Xử lý thêm nhân viên ở đây
        form.resetFields();
        if (onSuccess) onSuccess();
    };

    const handleCancel = () => {
        form.resetFields();
        if (onCancel) onCancel();
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={16}>
                    {/* Họ và tên */}
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ và tên!' },
                                { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự!' }
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />} 
                                placeholder="Nhập họ và tên" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>

                    {/* Email */}
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined />} 
                                placeholder="example@email.com" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Số điện thoại */}
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                            ]}
                        >
                            <Input 
                                prefix={<PhoneOutlined />} 
                                placeholder="0901234567" 
                                maxLength={10}
                                size="middle"
                            />
                        </Form.Item>
                    </Col>

                    {/* CMND/CCCD */}
                    <Col span={12}>
                        <Form.Item
                            label="CMND/CCCD"
                            name="idCard"
                            rules={[
                                { required: true, message: 'Vui lòng nhập CMND/CCCD!' },
                                { pattern: /^[0-9]{9,12}$/, message: 'CMND/CCCD không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<IdcardOutlined />} 
                                placeholder="Nhập số CMND/CCCD" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Ngày sinh */}
                    <Col span={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="birthDate"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày sinh!' }
                            ]}
                        >
                            <DatePicker 
                                placeholder="Chọn ngày sinh"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                size="middle"
                            />
                        </Form.Item>
                    </Col>

                    {/* Giới tính */}
                    <Col span={12}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[
                                { required: true, message: 'Vui lòng chọn giới tính!' }
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="male">Nam</Radio>
                                <Radio value="female">Nữ</Radio>
                                <Radio value="other">Khác</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Chức vụ */}
                    <Col span={12}>
                        <Form.Item
                            label="Chức vụ"
                            name="role"
                            rules={[
                                { required: true, message: 'Vui lòng chọn chức vụ!' }
                            ]}
                        >
                            <Select 
                                placeholder="Chọn chức vụ"
                                size="middle"
                                options={[
                                    { value: 'Admin', label: 'Admin' },
                                    { value: 'Staff', label: 'Staff' },
                                    { value: 'Manager', label: 'Manager' },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    {/* Trạng thái */}
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            initialValue="Đang làm việc"
                            rules={[
                                { required: true, message: 'Vui lòng chọn trạng thái!' }
                            ]}
                        >
                            <Select 
                                placeholder="Chọn trạng thái"
                                size="middle"
                                options={[
                                    { value: 'Đang làm việc', label: 'Đang làm việc' },
                                    { value: 'Nghỉ việc', label: 'Nghỉ việc' },
                                    { value: 'Tạm nghỉ', label: 'Tạm nghỉ' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Địa chỉ */}
                    <Col span={24}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ!' }
                            ]}
                        >
                            <Input 
                                prefix={<HomeOutlined />} 
                                placeholder="Nhập địa chỉ đầy đủ" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Mật khẩu */}
                    <Col span={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password 
                                placeholder="Nhập mật khẩu" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>

                    {/* Xác nhận mật khẩu */}
                    <Col span={12}>
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                placeholder="Nhập lại mật khẩu" 
                                size="middle"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Ghi chú */}
                    <Col span={24}>
                        <Form.Item
                            label="Ghi chú"
                            name="note"
                        >
                            <TextArea 
                                rows={2} 
                                placeholder="Nhập ghi chú (nếu có)"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Buttons */}
                <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block
                                size="middle"
                            >
                                Thêm nhân viên
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button 
                                htmlType="button" 
                                onClick={handleCancel} 
                                block
                                size="middle"
                            >
                                Hủy
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </>
    );
}