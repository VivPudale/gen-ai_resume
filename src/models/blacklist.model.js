const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token required to add in blacklist"],
    },
  },
  { timestamps: true },
);

const blacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = blacklistModel;
