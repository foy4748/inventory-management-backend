"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const saleSchema = new mongoose_1.Schema({
    quantity: {
        type: Number,
        min: 0,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    sale_date: {
        type: Date,
        required: true,
    },
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    modelNo: {
        type: String,
        required: true,
    },
    buyer_name: {
        type: String,
        required: true,
    },
});
const Sale = (0, mongoose_1.model)('Sale', saleSchema);
exports.default = Sale;
