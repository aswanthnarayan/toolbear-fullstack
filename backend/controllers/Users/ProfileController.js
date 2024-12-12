import HttpStatusEnum from "../../constants/httpStatus.js";
import MessageEnum from "../../constants/messages.js";
import User from "../../models/UserSchema.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({
        message: MessageEnum.Auth.NOT_FOUND,
      });
    }
    res.status(HttpStatusEnum.OK).json(user);
  } catch (error) {
    console.log("Error fetching User ", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({
      error: error.message || "Internal server error",
    });
  }
};


export const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, currentPassword, newPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (name !== undefined) user.name = name;
      if (phone !== undefined) user.phone = phone;
  
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Old password is required to update the password.' });
        }
  
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({field: "currentPassword", message: 'current password is incorrect.' });
        }
  
        user.password = newPassword;
      }
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
