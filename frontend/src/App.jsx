import React from 'react'
import { Table, Button, Popconfirm, Pagination } from 'antd';
import { getUsers, deleteUser } from './service/userService'
import { useState } from 'react';
import { useEffect } from 'react';
import { toast, Toaster } from "sonner";
import UserModel from './components/UserModel';
function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers(page, sortBy, sortOrder);
      setUsers(usersData.data);
      setTotalUsers(usersData.totalUsers);
    };
    fetchUsers();
  }, [page, sortBy, sortOrder]);

  const deleteUserById = async (id) => {
    await deleteUser(id);
    const usersData = await getUsers(page, sortBy, sortOrder);
    setUsers(usersData.data);
    setTotalUsers(usersData.totalUsers);
    toast.success('User deleted successfully!');
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    showModal();
  };

  const handleSuccess = async () => {
    const result = await getUsers(page, sortBy, sortOrder);
    setUsers(result.data);
    setTotalUsers(result.totalUsers);
    toast.success('User updated successfully!');
  };

  const handleSuccessAdd = async () => {
    const result = await getUsers(1, 'createdAt', 'desc');
    setUsers(result.data);
    setTotalUsers(result.totalUsers);
    toast.success('User added successfully!');
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => {
          const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
          setSortOrder(newSortOrder);
          setSortBy('name');
        }
      }),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => new Date(dob).toLocaleDateString(),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => {
          const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
          setSortOrder(newSortOrder);
          setSortBy('address');
        }
      }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, user) => (
        <>
          <Button onClick={() => handleEdit(user)} className='me-3' type="primary" >Edit</Button>
          <Popconfirm
            title={`Are you sure to delete user : ${user.name} ?`}
            onConfirm={() => deleteUserById(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    }
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className='container mt-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <h1>User Management</h1>
          <Button type="primary" onClick={showModal}>Add User</Button>
        </div>
        <div>
          {loading ? <p>Loading...</p> :
            <>
              <Table className='mt-3' dataSource={users} columns={columns} pagination={false} />
              <Pagination
                className='mt-3 d-flex justify-content-end'
                current={page}
                pageSize={10}
                onChange={(page) => setPage(page)}
                total={totalUsers}
              />
            </>
          }
        </div>
        <UserModel isOpen={isModalOpen} onClose={handleCancel} user={selectedUser} onSuccess={handleSuccess} onSuccessAdd={handleSuccessAdd} />

      </div>
    </>
  )
}

export default App
