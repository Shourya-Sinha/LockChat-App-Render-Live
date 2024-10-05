import mongoose from "mongoose";

const messageShema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required: true,
    },
    content:{
        type: String,
        required: function(){
            return this.messageType === "text"
        },
    },
    fileUrl:{
        type: String,
        required: function(){
            return this.messageType === "file"
        },
    },
    timestamps:{
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages",messageShema);

export default Message;