const expressAsyncHandler = require("express-async-handler")
const User = require("../Models/userModel")
const generateToken = require('../config/generateToken')
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const uploadSingle = upload.single('pic');


const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { pic } = req.body; 

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user) {
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic
        });
        console.log("User created:", user);
    } else {
        res.status(400);
        throw new Error("Failed creating user");
    }
});


const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("got user", user);
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3 * 60 * 60 * 1000
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});
const allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [

                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]

        } :
        {}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

const getUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            res.status(400);
            throw new Error('Error uploading image');
        }

        const user = await User.findById(req.user._id);

        if (user) {
            const originalEmail = user.email;
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            user.pic = req.file ? `/uploads/${req.file.filename}` : user.pic;

            const updatedUser = await user.save();

            if (originalEmail !== updatedUser.email) {
                const token = generateToken(updatedUser._id);
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'strict'
                });
            }

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                pic: updatedUser.pic
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    });
});

const changeUserPassword = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(req.body.currentPassword))) {
        if (req.body.newPassword) {
            user.password = req.body.newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(400);
            throw new Error("New password is required");
        }
    } else {
        res.status(401);
        throw new Error("Current password is incorrect");
    }
});

module.exports = { registerUser, authUser, allUsers, getUserProfile, updateUserProfile, changeUserPassword }
