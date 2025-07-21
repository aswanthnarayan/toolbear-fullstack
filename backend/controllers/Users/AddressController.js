import Address from "../../models/AddressSchema.js";
import HttpStatusEnum from "../../constants/httpStatus.js";
import MessageEnum from "../../constants/messages.js";

export const addAddress = async (req, res) => {
    try {
        const { fullName, address, area, phone, city, state, pincode } = req.body;
        const userId = req.user._id;   
        
        const addressCount = await Address.countDocuments({ userId });
        if (addressCount >= 5) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                error: "Maximum address limit reached. You can only add up to 5 addresses." 
            });
        }

        const newAddress = new Address({
            userId,
            fullName,
            address,
            area,
            phone,
            city,
            state,
            pincode
        }); 

        await newAddress.save();
        res.status(HttpStatusEnum.CREATED).json({ message: MessageEnum.Users.ADDRESS_ADDED });      
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}       

export const getAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await Address.find({ userId });
        res.status(HttpStatusEnum.OK).json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        await Address.findByIdAndDelete(addressId);
        res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Users.ADDRESS_DELETED });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}       

export const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        
        await Address.updateMany({ userId: req.user._id }, { $set: { isDefault: false } });
        await Address.findByIdAndUpdate(addressId, { $set: { isDefault: true } });
        res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Users.ADDRESS_SET_DEFAULT });
    } catch (error) {
        console.error("Error setting default address:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}   



export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { fullName, address, area, phone, city, state, pincode } = req.body;
        await Address.findByIdAndUpdate(addressId, {
            fullName,
            address,
            area,
            phone,
            city,
            state,
            pincode
        });
        res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Users.ADDRESS_UPDATED });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}