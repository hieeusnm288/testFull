import User from "../model/User.js";

export const createUser = async (req, res) => {
    try {
        const {name, email, dob, gender, address} = req.body;
        const newUser = new User({name, email, dob, gender, address});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({message: "Server Error"});
    }
}

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const sortBy = req.query.sortBy || 'name'; 
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;

        const sortOption = {};
        sortOption[sortBy] = sortOrder;

        const users = await User.find()
            .sort(sortOption) 
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            data: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({message: "Server Error"});
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateUser = await User.findByIdAndUpdate(userId, req.body, {new: true});
        if (!updateUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(updateUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Server Error"});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({message: "Server Error"});
    }
}