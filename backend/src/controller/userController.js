import User from "../model/User.js";

export const createUser = async (req, res) => {
    try {
        const {name, email, dob, gender, address} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already exists"});
        }
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
        
        const sortByField = req.query.sortBy || 'createdAt'; 
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; 

        const skip = (page - 1) * limit;

        const sortObj = {};
        sortObj[sortByField] = sortOrder;

        const users = await User.find()
            .sort(sortObj) 
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
        const {email} = req.body;
        
        // Check if email already exists for another user
        if (email) {
            const existingUser = await User.findOne({email, _id: {$ne: userId}});
            if (existingUser) {
                return res.status(400).json({message: "Email already exists"});
            }
        }
        
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