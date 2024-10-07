const Status = require('../models/status');

const addStatus = async (req, res) => {
    try {
        const status = await Status.create(req.body);
        if (!status) return res.Status(403).json({ message: 'failed to add status', success: false });
        return res.status(202).json({ message: 'successfully added!', success: true });
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const getAllStatus = async (req, res) => {
    try {
        const allStatus = await Status.find({});
        res.status(202).json(allStatus);
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const getAStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const found = await Status.findById(id);
        if (!found) return res.Status(403).json({ message: 'no status exists!', success: false });
        res.status(202).json({ found })
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Status.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'failed to update status', success: false });
        res.status(202).json({ message: 'successfully updated!', success: true });
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Status.findByIdAndDelete(id);
        if (!deleted) return res.Status(403).json({ message: 'failed to delete status', success: false });
        res.status(202).json({ message: 'successfully deleted!', success: true });
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const findWithStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const found = await Status.findOne({ status: status });
        res.status(201).json({ message: 'Status must be unique!', success: false, found });
    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
const findWithColor = async (req, res) => {
    try {
        const { color } = req.params;
        const found = await Status.findOne({ color: color });
        res.status(202).json({ message: 'Color must be unique!', success: false, found });

    } catch (error) {
        console.log(error);
        res.status(505).json({ message: error.message, success: false })
    }
}
module.exports = { addStatus, getAllStatus, getAStatus, updateStatus, deleteStatus, findWithStatus, findWithColor };
