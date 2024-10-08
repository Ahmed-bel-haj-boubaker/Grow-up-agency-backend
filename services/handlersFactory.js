const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeature");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const data = await model.findOneAndDelete({ _id: id });
      return res.status(204).json({ data: data, msg: "document is deleted" });
    } catch (error) {
      const { id } = req.params;

      next(new ApiError(`No document for this id: ${id}`, 404));
      return res.status(204).json({ msg: "document is deleted" });
    }
  });

exports.getDocument = (model) =>
  asyncHandler(async (req, res) => {
    try {
      const countDocument = await model.countDocuments();

      const apiFeature = new ApiFeature(model.find(), req.query)
        .pagination(countDocument)
        .filter()
        .search("Product")
        .limitFields()
        .sort();
      const { mongooseQuery, paginationResult } = apiFeature;
      const documents = await mongooseQuery;

      if (documents) {
        return res.status(200).json({
          results: documents.length,
          paginationResult,
          data: documents,
        });
      }
    } catch (error) {
      // Handle any errors
      return res.status(500).json({ error: error.message });
    }
  });

exports.addDocument = (Model) =>
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getById = (model) =>
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const document = await model.findById(id);
      res.status(200).json({ data: document });
    } catch (error) {
      const { id } = req.params;
      res.status(200).json({ error: error });
      return next(new ApiError(`No document for this id: ${id}`, 404));
    }
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const updatedDocument = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDocument) {
      return next(
        new ApiError(`No document for this id: ${req.params.id}`, 404)
      );
    }
    console.log("updatedDocument", updatedDocument);
    updatedDocument.save();

    res.status(200).json({ updatedDocument: updatedDocument });
  });
