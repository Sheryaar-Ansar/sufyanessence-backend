const  Category  = require('../models/Category');

 const createCategory = async (req, res) => {
    try {
        const { title, name } = req.body;
        const existingCategory = await Category.findOne({ title });
        if(existingCategory) {
            return res.status(400).json({ message: 'Category with this title already exists' });
        }
        const newCategory = await Category.create({ title, name });
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

 const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        if(categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
 const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if(!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

 const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, name } = req.body;
        const category = await Category.findById(id);
        if(!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.title = title || category.title;
        category.name = name || category.name;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

 const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if(!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory }