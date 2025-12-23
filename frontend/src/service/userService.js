import api from "../lib/axios";

const getUsers = async (page,sortBy, sortOrder) => {
    const response =  await api.get(`/users?page=${page}&limit=${10}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return response.data;
};

const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export { getUsers, deleteUser, createUser, updateUser };