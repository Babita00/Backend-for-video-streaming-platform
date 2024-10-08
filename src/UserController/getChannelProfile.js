import { ApiError } from "../utils/APIerror";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }
  const channel = User.aggregate([
    //to find match
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    // see subscriber through channel
    //or see no of subscriber for each channel
    {
      $lookup: {
        from: "subscriptions",
        localField: _id,
        foreignField: "channel",
        as: "subscribers",
      },
    },

    //how many channel I have subscribed to
    {
      $lookup: {
        from: "subscriptions",
        localField: _id,
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        ChannelIsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        ChannelIsSubscribedToCount: 1,
        isSubscribed: 1,
        // avatar: 1,
        // coverImage: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(400, "Channel does not exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel is fetched successfully")
    );
});
export { getUserChannelProfile };
