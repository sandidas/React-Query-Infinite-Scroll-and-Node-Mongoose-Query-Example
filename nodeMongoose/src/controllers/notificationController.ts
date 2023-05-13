const { ObjectId } = require('mongodb');
import Noti from "../models/Noti";
export const getAllNoti = async (req, res) => {

    // const cursor = Number(req.query.cursor);
    const cursor = parseInt(req.query.cursor) ? new ObjectId(req.query.cursor) : null;
    const limit = 10; // Number of notifications per page
    const skip = (cursor - 1) * limit;


    try {

        const query = cursor
            ? Noti.find({ _id: { $lt: cursor } })
                .sort({ _id: -1 })
                .limit(limit)
            : Noti.find()
                .sort({ _id: -1 })
                .limit(limit);

        const results = await query.exec();
        const lastItem = results[results.length - 1];
        const nextCursor = lastItem ? lastItem._id.toString() : null;
        console.log(nextCursor);
        // Return the data and the total number of documents
        res.status(200).json({ success: true, status: 200, message: "Success", notifications: results, nextCursor: nextCursor });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};