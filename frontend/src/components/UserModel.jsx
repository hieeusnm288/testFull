import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, DatePicker, Select } from 'antd';
import { createUser, updateUser } from "../service/userService";
import moment from 'moment';

const UserModel = ({ isOpen, onClose, user, onSuccess }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                dob: user.dob ? moment(user.dob, 'YYYY-MM-DD') : null,
            });
        } else {
            form.resetFields();
        }
    }, [user, form]);

    const onFinish = values => {
        if (user) {
            form.validateFields().then(() => {
                const formattedValues = {
                    ...values,
                    dob: values.dob.format('YYYY-MM-DD'),
                };
                updateUser(user._id, formattedValues).then(() => {
                    onClose();
                    form.resetFields();
                    if (onSuccess) {
                        onSuccess();
                    }
                });
            }).catch((info) => {
                console.log('Validate Failed:', info);
            });
        } else {
            form.validateFields().then(() => {
                const formattedValues = {
                    ...values,
                    dob: values.dob.format('YYYY-MM-DD'),
                };
                createUser(formattedValues).then(() => {
                    onClose();
                    form.resetFields();
                    if (onSuccess) {
                        onSuccess();
                    }
                });
            }).catch((info) => {
                console.log('Validate Failed:', info);
            });
        }
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Modal
            title={`${user ? 'Edit User' : 'Add User'}`}
            open={isOpen}
            onCancel={onClose}
            footer={false}
        >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout='vertical'
                form={form}

            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[
                        { required: true, message: 'Please input your date of birth!' },
                        {
                            validator: (_, value) => {
                                if (!value || value.isBefore(moment(), 'day') || value.isSame(moment(), 'day')) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Date of birth cannot be greater than today!'));
                            }
                        }
                    ]}
                >
                    <DatePicker disabledDate={(current) => current && current > moment().endOf('day')} />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                    <Select>
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UserModel