const Unit = require('../models/unit');

const addUnit = async (req, res) => {
    try {
        const addedUnit = await Unit.create(req.body);
        if (!addedUnit) return res.status(404).json({
            message: "Failed to add Unit",
            success: false
        });
        res.status(202).json({
            message: 'Successfully added!',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const allUnit = async (req, res) => {
    try {
        const units = await Unit.find({});
        if (!units)
            return res.status(404).json({
                message: "Failed to fetch all units!",
                success: false
            })
        res.status(202).json(units);

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Unit.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({
            message: 'Failed to update!',
            success: false
        })
        return res.status(202).json({
            message: 'Successfully Updated!',
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Unit.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({
            message: "Failed to delete!",
            success: false
        })
        return res.status(202).json({
            message: 'Successfully deleted!',
            success: true,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { addUnit, allUnit, updateUnit, deleteUnit };
