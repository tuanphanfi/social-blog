const utilsHelper = require("../helpers/utils.helper");
const Friendship = require("../models/friendship");
const friendshipController = {};

friendshipController.sendRequest = async (req, res, next) => {
  try {
    const senderID = req.userId;
    const receiverID = req.params.id;

    const friendship = await Friendship.findOne({
      from: senderID,
      to: receiverID,
    });
    let newFriend;
    if (friendship) {
      newFriend = await Friendship.findByIdAndUpdate(friendship._id, {
        status: "requesting",
      });
    } else {
      newFriend = await Friendship.create({
        from: senderID,
        to: receiverID,
        status: "requesting",
      });
    }

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      newFriend,
      null,
      "Send a friend request successful"
    );
  } catch (error) {
    next(error);
  }
};

friendshipController.acceptRequest = async (req, res, next) => {
  try {
    const friendshipID = req.params.id;
    const friendship = await Friendship.findByIdAndUpdate(
      friendshipID,
      {
        status: "accepted",
      },
      { new: true }
    );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      friendship,
      null,
      "Send a friend request successful"
    );
  } catch (error) {
    next(error);
  }
};

friendshipController.declineRequest = async (req, res, next) => {
  try {
    const friendshipID = req.params.id;
    const friendship = await Friendship.findByIdAndUpdate(
      friendshipID,
      {
        status: "decline",
      },
      { new: true }
    );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      friendship,
      null,
      "Send a friend request successful"
    );
  } catch (error) {
    next(error);
  }
};

friendshipController.cancelRequest = async (req, res, next) => {
  try {
  } catch (error) {
    nex(error);
  }
};

friendshipController.removeRequest = async (req, res, next) => {
  try {
    const friendshipID = req.params.id;
    const friendship = await Friendship.findByIdAndUpdate(
      friendshipID,
      {
        status: "decline",
      },
      { new: true }
    );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      friendship,
      null,
      "Send a friend request successful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = friendshipController;
