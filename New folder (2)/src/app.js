const express = require('express');
const validator = require('validator');
const { connectDB } = require('../config/database');
const { User } = require('../model/user');

const app = express()
const port = 3000;
app.use(express.json());
// CRUD



app.use('/addUser', async (req, res) => {
    const data = req.body
    try {
        const user = await User(data)

        await user.save()

        res.send({
            message: 'User added successfully !',
            data: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'Error adding user',
            error: error.message
        })
    }
})


app.use('/editUser/:id', async (req, res) => {
    const data = req.body
    const { id } = req.params

    // Validate email if provided
    if (data.email && !validator.isEmail(data.email)) {
        return res.status(400).send({
            message: 'Invalid email format'
        })
    }

    // Validate phone if provided
    if (data.phone && !validator.isMobilePhone(data.phone)) {
        return res.status(400).send({
            message: 'Invalid phone number format'
        })
    }

    // Validate age if provided
    if (data.age && !validator.isInt(data.age.toString(), { min: 10, max: 40 })) {
        return res.status(400).send({
            message: 'Age must be a number between 0 and 120'
        })
    }

    try {
        const user = await User.findByIdAndUpdate(id, data, { new: true })
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            })
        }
        res.send({
            message: 'User updated successfully !',
            data: user
        })
    } catch (error) {
        res.status(400).send({
            message: 'Error updating user',
            error: error.message
        })
    }
})

app.get('/getUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        res.send({
            message: 'User retrieved successfully !',
            data: user
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error retrieving user',
            error: error.message
        });
    }
});

app.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find({});
        res.send({
            message: 'Users retrieved successfully!',
            data: users
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error retrieving users',
            error: error.message
        });
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        res.send({
            message: 'User deleted successfully !',
            data: user
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error deleting user',
            error: error.message
        });
    }
});

connectDB().then(() => {
    console.log('Database connected');

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}).catch((error) => {
    console.log('Database connection error:', error)
});