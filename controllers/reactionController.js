const utilsHelper = require("../helpers/utils.helper");
const Reaction = require("../models/reaction");
const reactionController = {};

//create
reactionController.createAReaction = async (req, res, next) => {
  try {
    let { userId } = req;
    let { targetType, emoji, target } = req.body;

    // Find the reaction of the current user
    let reaction = await Reaction.findOne({
      targetType,
      target,
      user: req.userId,
    });
    if (!reaction) {
      await Reaction.create({
        user: userId,
        targetType,
        emoji,
        target,
      });
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        reaction,

        null,
        "Create a reaction successful"
      );
    } else {
      if (reaction.emoji === emoji) {
        await Reaction.findOneAndDelete({ _id: reaction._id });
        return utilsHelper.sendResponse(
          res,
          200,
          true,
          null,
          null,
          "Removed reaction"
        );
      } else {
        await Reaction.findOneAndUpdate({ _id: reaction._id }, { emoji });
        return utilsHelper.sendResponse(
          res,
          200,
          true,
          null,
          null,
          "Updated reaction"
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = reactionController;
