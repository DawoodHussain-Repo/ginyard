const update = async (Model, req, res) => {
  const userFilter = req.admin ? { createdBy: req.admin._id } : {};
  // Find document by id and updates with the required fields
  req.body.removed = false;
  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      ...userFilter,
    },
    req.body,
    {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }
  ).exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
