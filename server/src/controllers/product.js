const Product = require('../models/product');

const findProductName = async (req, res) => {
    const { productname } = req.body;
    const target = await Product.findOne({ productname: productname });
    if (!target)
        return res.status(404).json({
            message: 'product not found!',
            success: false
        });
    return res.status(202).json(target)
}
const findProductId = async (req, res) => {
    const { id } = req.params;
    const target = await Product.findById(id);
    if (!target)
        return res.status(404).json({
            message: 'product not found!',
            success: false
        });
    return res.status(202).json(target)
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({
            message: "Failed to delete!",
            success: false
        })
        return res.status(202).json({
            message: 'Successfully deleted!',
            success: true,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({
                message: 'Failed to update!',
                success: false
            })
        return res.status(202).json({
            message: 'Successfully Updated!',
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const getAllProduct = async (req, res) => {
    try {
        const allProduct = await Product.find({});
        res.status(202).json(allProduct);

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const addProduct = async (req, res) => {
    try {
        const addedProduct = await Product.create(req.body);
        console.log(req.body)
        if (!addedProduct)
            return res.status(404).json({
                message: 'failed to add product!',
                success: false
            });
        res.status(202).json({
            message: 'Successfully added!',
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
module.exports = { addProduct, getAllProduct, updateProduct, deleteProduct, findProductName, findProductId };
