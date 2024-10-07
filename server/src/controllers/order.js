const Order = require('../models/order');

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder)
            return res.status(404).json({
                message: 'failed to delete Order!',
                success: false
            })
        res.status(202).json({
            message: 'successfully deleted!',
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(505).json({
            message: error.message,
            success: false
        })
    }
}
const allOrder = async (req, res) => {
    try {
        const orderLists = await Order.find({});
        res.status(202).json(orderLists);
    } catch (error) {
        console.log(error);
        res.status(503).json({
            message: error.message,
            success: false
        })
    }
}
const modifyOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder)
            return res.status(404).json({
                message: 'Failed to update Order!',
                success: false
            })
        res.status(202).json(updatedOrder);
    } catch (error) {
        console.log(error);
        res.status(503).json({
            message: error.message,
            success: false
        })
    }
}
const placeOrder = async (req, res) => {
    try {
        const placedorder = await Order.create(req.body);
        if (!placedorder)
            return res.status(404).json({
                message: 'failed to order product!',
                success: false
            })
        res.status(202).json({
            message: 'Successfully ordered product!',
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(503).json({
            message: error.message,
            success: false
        })
    }
}
module.exports = { placeOrder, allOrder, modifyOrder, deleteOrder }
