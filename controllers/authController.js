const express = require('express')
const jwt = require('jsonwebtoken')
const  Auth  = require('../models/Auth')

const generateToken = (id, role, email) => {
    return jwt.sign(
        { id, role, email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

 const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }
        const existingUser = await Auth.findOne({email })
        if(existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }
        const newUser = await Auth.create({ ...req.body })
        res.status(201).json({
            message: 'User registered successfully', user: newUser})
        
    } catch (error) {
        return res.status(500).json({message: 'Server error', error: error.message})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No such user found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect Email or Password' });
        }

        const token = generateToken(user._id, user.role, user.email);

        return res.status(200).json({
            message: 'Login successful',
            token,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {register, login}