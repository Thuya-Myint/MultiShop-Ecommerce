const Shop = require('../models/shop');

const addNewShop = async (req, res) => {
    try {
        const addedShop = await Shop.create(req.body);
        if (!addedShop)
            return res.status(404).json({
                message: 'failed to order product!',
                success: false
            })
        res.status(202).json(addedShop);
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: error.message });
    }
}
const editShop = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedShop = await Shop.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedShop)
            return res.status(404).json({ message: 'failed to update Shop!', success: false })
        res.status(202).json(updatedShop)
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: error.message });
    }
}
const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShop = await Shop.findByIdAndDelete(id);
        if (!deletedShop)
            return res.status(404).json({ message: 'failed to delete Shop!', success: false })
        res.status(202).json(deletedShop);
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: error.message });
    }
}
const allShop = async (req, res) => {
    try {
        const shops = await Shop.find({});
        res.status(202).json(shops);
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: error.message });
    }
}
const findShop = async (req, res) => {

    try {
        const { shopName } = req.params;
        const found = await Shop.findOne({ shopName: shopName });
        res.status(202).json(found);
    } catch (error) {
        console.log(error);
        res.status(503).json({ message: error.message })
    }
}
module.exports = { addNewShop, allShop, deleteShop, editShop, findShop }
