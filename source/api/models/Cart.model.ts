import mongoose from "mongoose";
import { trimObject } from "../utilities/helperFunctions";
import { PostBookDocument } from "./PostBook.model";
import { UserDocument } from "./User.model";

type items = {
    book: string | PostBookDocument;
    quantity: number;
    totalPrice: number;
};

export interface CartData {
    userId: string | UserDocument;
    cartItems: items[];
}

export interface CartDocument extends CartData, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    addToCart(
        bookID: string,
        quantity: number,
        totalPrice: number
    ): Promise<CartDocument>;
}

export const cartSchema = new mongoose.Schema<CartDocument>(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        cartItems: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "postBook",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                totalPrice: {
                    type: Number,
                },
            },
        ],
        isArchived: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.methods.addToCart = async function (
    bookID: string,
    quantity: number = 1,
    totalPrice: number
): Promise<any> {
    let cartBookIndex = -1;
    if (this.cartItems.length > 0) {
        cartBookIndex = this.cartItems.findIndex((currentBook: any) => {
            return bookID.toString() == currentBook.book.toString();
        });
    }
    let currentQuantity = quantity;
    const updatedCartItems = [...this.cartItems];
    if (cartBookIndex >= 0) {
        // means the cart already has the product
        updatedCartItems[cartBookIndex].quantity = currentQuantity;
        updatedCartItems[cartBookIndex].totalPrice = totalPrice;
    } else {
        updatedCartItems.push({
            book: bookID,
            quantity: currentQuantity,
            totalPrice,
        });
    }
    this.cartItems = updatedCartItems;
    return this.save();
};

const Cart = mongoose.model<CartDocument>("cart", cartSchema);

export default Cart;
