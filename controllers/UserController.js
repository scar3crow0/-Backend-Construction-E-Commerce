const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const RegisterCompany = async (req, res) => {
  try {
    const { companyname, address } = req.body;

    const userid = req.user.userId;
    // Find the user by userId
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's company name and address
    user.companyname = companyname;
    user.address = address;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "company registered", user });
  } catch (error) {
    console.error("registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token upon successful login
    const token = jwt.sign({ userId: user._id }, "oogabooga", {
      expiresIn: "10h", // Adjust as needed
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  Login,
  Register,
  RegisterCompany,
};
