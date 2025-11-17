import { Col, Row } from "antd";
import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import Password from "antd/es/input/Password";
import { useNavigate } from "react-router-dom";





export default function Login() {
  const navigate = useNavigate();



  const onFinish = values => {

    fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: values.username,
        password: values.password   // chữ thường
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Network error: " + res.status);
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          const token = data.token;
          // const firstLogin = data.result.firstLogin;

          console.log("Token:", token);
          console.log("User Data:", data.user.company);
          if(data.user.company){
            localStorage.setItem("CompanyId", data.user.company.id);
          }
          // console.log("First login:", firstLogin);
          // localStorage.setItem("CompanyId", data.user.hotel.id);
          localStorage.setItem("authToken", token);
          

             navigate("/Admin")
          // if (firstLogin) {
          //   console.log("Redirect to change password page...");
          //   navigate("/Admin")
          // } else {
          //   console.log("Redirect to dashboard...");
          // }
        } else {
          console.error("Login failed:", data);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });


  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };


  return (
    <div style={{ minHeight: "80vh", width: "300px", minWidth: "60vw", margin: '0 auto' }}>

      <Row>
        <Col span={12}>
          anh
        </Col>
        <Col span={12} style={{ background: 'red', padding: 10 }}>
          <Form
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            

            <Form.Item name="remember" valuePropName="checked" label={null} style={{ textAlign: "left" }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null} style={{}}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Login
              </Button>
            </Form.Item>
          </Form>

        </Col>

      </Row>
    </div>
  )
}