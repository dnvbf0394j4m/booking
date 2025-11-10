// import { Col, Row } from 'antd';
// import { Space, Table, Tag, Button, Input, Select } from 'antd';
// import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
// import { useState } from 'react';
// import { Outlet } from 'react-router-dom';

// const { Search } = Input;

// export default function Employee() {
//     const [searchText, setSearchText] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');

//     // Bảng phân quyền
//     const permissionColumns = [
//         {
//             title: 'Quyền hạn',
//             dataIndex: 'name',
//             key: 'name',
//             render: text => <a>{text}</a>,
//         },
//         {
//             title: 'Admin',
//             dataIndex: 'admin',
//             key: 'admin',
//         },
//         {
//             title: 'Staff',
//             dataIndex: 'staff',
//             key: 'staff',
//         },
//     ];
    
//     const permissionData = [
//         {
//             key: '1',
//             name: 'Xem booking',
//             admin: 'true',
//             staff: 'false'
//         },
//         {
//             key: '2',
//             name: 'Thêm booking',
//             admin: 'true',
//             staff: 'false'
//         },
//         {
//             key: '3',
//             name: 'Sửa/Xóa booking',
//             admin: 'true',
//             staff: 'false'
//         },
//         {
//             key: '4',
//             name: 'Quản lý chi phí',
//             admin: 'true',
//             staff: 'false'
//         },
//     ];

//     // Bảng danh sách nhân viên
//     const employeeColumns = [
//         {
//             title: 'STT',
//             dataIndex: 'stt',
//             key: 'stt',
//             width: 60,
//         },
//         {
//             title: 'Họ và tên',
//             dataIndex: 'fullName',
//             key: 'fullName',
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Số điện thoại',
//             dataIndex: 'phone',
//             key: 'phone',
//         },
//         {
//             title: 'Chức vụ',
//             dataIndex: 'role',
//             key: 'role',
//             render: (role) => (
//                 <Tag color={role === 'Admin' ? 'red' : 'blue'}>
//                     {role}
//                 </Tag>
//             ),
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status) => (
//                 <Tag color={status === 'Đang làm việc' ? 'green' : 'default'}>
//                     {status}
//                 </Tag>
//             ),
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Button type="link" icon={<EditOutlined />}>Sửa</Button>
//                     <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
//                 </Space>
//             ),
//         },
//     ];

//     const employeeData = [
//         {
//             key: '1',
//             stt: 1,
//             fullName: 'Nguyễn Văn A',
//             email: 'nguyenvana@example.com',
//             phone: '0901234567',
//             role: 'Admin',
//             status: 'Đang làm việc',
//         },
//         {
//             key: '2',
//             stt: 2,
//             fullName: 'Trần Thị B',
//             email: 'tranthib@example.com',
//             phone: '0912345678',
//             role: 'Staff',
//             status: 'Đang làm việc',
//         },
//         {
//             key: '3',
//             stt: 3,
//             fullName: 'Lê Văn C',
//             email: 'levanc@example.com',
//             phone: '0923456789',
//             role: 'Staff',
//             status: 'Đang làm việc',
//         },
//         {
//             key: '4',
//             stt: 4,
//             fullName: 'Phạm Thị D',
//             email: 'phamthid@example.com',
//             phone: '0934567890',
//             role: 'Staff',
//             status: 'Nghỉ việc',
//         },
//         {
//             key: '5',
//             stt: 5,
//             fullName: 'Hoàng Văn E',
//             email: 'hoangvane@example.com',
//             phone: '0945678901',
//             role: 'Staff',
//             status: 'Nghỉ việc',
//         },
//     ];

//     // Lọc dữ liệu theo trạng thái và tìm kiếm
//     const filteredData = employeeData.filter(employee => {
//         const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
//         const matchesSearch = 
//             employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
//             employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
//             employee.phone.includes(searchText);
        
//         return matchesStatus && matchesSearch;
//     });

//     const handleSearch = (value) => {
//         setSearchText(value);
//     };

//     const handleStatusChange = (value) => {
//         setStatusFilter(value);
//     };

//     return (
//         <>
//             <div>
//                 <Row className="header" style={{ marginBottom: 20 }}>
//                     <Col span={4}><h3 style={{fontSize:20}}>Quản Lý Nhân Viên</h3></Col>
//                     <Col span={4} offset={16}>
//                         <Button type="primary">Thêm mới</Button>
//                     </Col>
//                 </Row>

//                 {/* Bảng phân quyền */}
//                     {/* <Row style={{ marginBottom: 30 }}>
//                         <Col span={24}>
//                             <h3>Phân quyền hệ thống</h3>
//                             <Table columns={permissionColumns} dataSource={permissionData} pagination={false} />
//                         </Col>
//                     </Row> */}

//                 {/* Bộ lọc và tìm kiếm */}
//                 <Row style={{ marginBottom: 20 }} gutter={16}>
//                     <Col span={8}>
//                         <Search
//                             placeholder="Tìm kiếm theo tên, email, số điện thoại..."
//                             allowClear
//                             enterButton={<SearchOutlined />}
//                             size="large"
//                             onSearch={handleSearch}
//                             onChange={(e) => setSearchText(e.target.value)}
//                         />
//                     </Col>
//                     <Col span={6}>
//                         <Select
//                             size="large"
//                             style={{ width: '100%' }}
//                             placeholder="Lọc theo trạng thái"
//                             defaultValue="all"
//                             onChange={handleStatusChange}
//                             options={[
//                                 { value: 'all', label: 'Tất cả trạng thái' },
//                                 { value: 'Đang làm việc', label: 'Đang làm việc' },
//                                 { value: 'Nghỉ việc', label: 'Nghỉ việc' },
//                             ]}
//                         />
//                     </Col>
//                     <Col span={10} style={{ textAlign: 'right' }}>
//                         <span style={{ lineHeight: '40px', color: '#666' }}>
//                             Tìm thấy: <strong>{filteredData.length}</strong> nhân viên
//                         </span>
//                     </Col>
//                 </Row>

//                 {/* Bảng danh sách nhân viên */}
//                 <Row>
//                     <Col span={24}>
                       
//                         <Table 
//                             columns={employeeColumns} 
//                             dataSource={filteredData} 
//                             pagination={{ pageSize: 10 }} 
//                         />
//                     </Col>
//                 </Row>
//             </div>
            
//         </>
//     );
// }



import { Col, Row } from 'antd';
import { Space, Table, Tag, Button, Input, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CreateEmployee from './CreateEmlpoyee';

const { Search } = Input;

export default function Employee() {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Bảng phân quyền
    const permissionColumns = [
        {
            title: 'Quyền hạn',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
        },
        {
            title: 'Staff',
            dataIndex: 'staff',
            key: 'staff',
        },
    ];
    
    const permissionData = [
        {
            key: '1',
            name: 'Xem booking',
            admin: 'true',
            staff: 'false'
        },
        {
            key: '2',
            name: 'Thêm booking',
            admin: 'true',
            staff: 'false'
        },
        {
            key: '3',
            name: 'Sửa/Xóa booking',
            admin: 'true',
            staff: 'false'
        },
        {
            key: '4',
            name: 'Quản lý chi phí',
            admin: 'true',
            staff: 'false'
        },
    ];

    // Bảng danh sách nhân viên
    const employeeColumns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 60,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'Admin' ? 'red' : 'blue'}>
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Đang làm việc' ? 'green' : 'default'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />}>Sửa</Button>
                    <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const employeeData = [
        {
            key: '1',
            stt: 1,
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
            role: 'Admin',
            status: 'Đang làm việc',
        },
        {
            key: '2',
            stt: 2,
            fullName: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '0912345678',
            role: 'Staff',
            status: 'Đang làm việc',
        },
        {
            key: '3',
            stt: 3,
            fullName: 'Lê Văn C',
            email: 'levanc@example.com',
            phone: '0923456789',
            role: 'Staff',
            status: 'Đang làm việc',
        },
        {
            key: '4',
            stt: 4,
            fullName: 'Phạm Thị D',
            email: 'phamthid@example.com',
            phone: '0934567890',
            role: 'Staff',
            status: 'Nghỉ việc',
        },
        {
            key: '5',
            stt: 5,
            fullName: 'Hoàng Văn E',
            email: 'hoangvane@example.com',
            phone: '0945678901',
            role: 'Staff',
            status: 'Nghỉ việc',
        },
    ];

    // Lọc dữ liệu theo trạng thái và tìm kiếm
    const filteredData = employeeData.filter(employee => {
        const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
        const matchesSearch = 
            employee.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
            employee.phone.includes(searchText);
        
        return matchesStatus && matchesSearch;
    });

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        // Xử lý sau khi thêm thành công
    };

    return (
        <>
            <div>
                <Row className="header" style={{ marginBottom: 20 }}>
                    <Col span={4}>Quản Lý Nhân Viên</Col>
                    <Col span={4} offset={16}>
                        <Button type="primary" onClick={showModal}>Thêm mới</Button>
                    </Col>
                </Row>

                {/* Bảng phân quyền */}
                {/* <Row style={{ marginBottom: 30 }}>
                    <Col span={24}>
                        <h3>Phân quyền hệ thống</h3>
                        <Table columns={permissionColumns} dataSource={permissionData} pagination={false} />
                    </Col>
                </Row> */}

                {/* Bộ lọc và tìm kiếm */}
                <Row style={{ marginBottom: 20 }} gutter={16}>
                    <Col span={8}>
                        <Search
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Lọc theo trạng thái"
                            defaultValue="all"
                            onChange={handleStatusChange}
                            options={[
                                { value: 'all', label: 'Tất cả trạng thái' },
                                { value: 'Đang làm việc', label: 'Đang làm việc' },
                                { value: 'Nghỉ việc', label: 'Nghỉ việc' },
                            ]}
                        />
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <span style={{ lineHeight: '40px', color: '#666' }}>
                            Tìm thấy: <strong>{filteredData.length}</strong> nhân viên
                        </span>
                    </Col>
                </Row>

                {/* Bảng danh sách nhân viên */}
                <Row>
                    <Col span={24}>
                       
                        <Table 
                            columns={employeeColumns} 
                            dataSource={filteredData} 
                            pagination={{ pageSize: 10 }} 
                        />
                    </Col>
                </Row>

                {/* Modal thêm nhân viên */}
                <Modal
                    title="Thêm nhân viên mới"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={900}
                    centered
                >
                    <CreateEmployee onSuccess={handleOk} onCancel={handleCancel} />
                </Modal>
            </div>
        </>
    );
}