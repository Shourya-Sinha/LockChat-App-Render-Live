import mongoose from "mongoose";

// const channelSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required: true,
//     },
//     members: [{ // Change 'member' to 'members'
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Users', // Make sure this references the correct Users model
//         required: true,
//       }],
//     admin:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Users',
//         required: true,
//     },
//     messages:[{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Messages',
//         required: false,
//     }],
//     createdAt:{
//         type: Date,
//         default: Date.now,
//     },
//     updatedAt:{
//         type: Date,
//         default: Date.now,
//     }
// });

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Messages' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

// channelSchema.pre("save", function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// channelSchema.pre("findOneAndUpdate", function (next) {
//     this.set({updatedAt:Date.now()});
// });

const Channel = mongoose.model("Channels",channelSchema);

export default Channel;