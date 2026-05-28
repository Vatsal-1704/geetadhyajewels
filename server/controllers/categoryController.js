const Category = require("../models/Category");

exports.getCategories = async (req, res) => { try { res.json(await Category.find({ isActive: true }).populate("parent", "name").sort({ displayOrder: 1 })); } catch (err) { res.status(500).json({ message: err.message }); } };
exports.createCategory = async (req, res) => { try { res.status(201).json(await Category.create(req.body)); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.updateCategory = async (req, res) => { try { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.deleteCategory = async (req, res) => { try { await Category.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ message: err.message }); } };
