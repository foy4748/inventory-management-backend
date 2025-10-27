"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    modelNo: { type: String, required: true },
    category: { type: String, required: true },
    operatingSystem: { type: String, required: true },
    connectivity: { type: [String], required: true },
    powerSource: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    releaseDate: { type: String, required: true },
    // Features
    storage: { type: Number, required: true },
    ram: { type: Number, required: true },
    camera: { type: Number, required: true },
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
