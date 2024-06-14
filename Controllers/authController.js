const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('../middlewares/validator')

exports.signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!validator.isValid(name)) {
      return res.status(400).send({ status: false, message: "name is required" })
    }

    if (!validator.char(name)) {
      return res.status(400).send({ status: false, message: "Please mention valid Name" })
    }

    if (!validator.validateString(name)) {
      return res.status(400).send({ status: false, message: "Spaces are not allowed in fname" })
    }

    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, message: "Email is required" })
    }

    if (!validator.isRightFormatemail(email)) {
      return res.status(400).send({ status: false, message: "Please enter a valid email" })
    }

    let uniqueEmail = await User.findOne({ email })
    if (uniqueEmail) {
      return res.status(400).send({ status: false, message: "Email already exists" })
    }

    if (!validator.isValid(mobile)) {
      return res.status(400).send({ status: false, message: "mobile number is required" })
    }

    if (!validator.isvalidPhoneNumber(mobile)) {
      return res.status(400).send({ status: false, message: "Please enter a valid mobile no" })
    }

    let uniquephone = await User.findOne({ mobile })
    if (uniquephone) {
      return res.status(400).send({ status: false, message: "phone already exists" })
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: "Password is required" })
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "The length of password should be in between 8-15 characters" })
    }

    if (!validator.validateString(password)) {
      return res.status(400).send({ status: false, message: "Spaces are not allowed in password" })
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, mobile, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).send({ status: true, token })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isValidRequestBody(email)) {
      res.status(400).send({ status: false, msg: "plese pass required parameters" })
      return
    }
    if (!validator.isValid(email)) {
      res.status(400).send({ status: false, msg: "Email is required" })
      return
    }
    if (!validator.isRightFormatemail(email)) {
      return res.status(404).send({ status: false, msg: "Invalid Email" })
    }

    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, msg: "Password is required" })
      return
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ status: false, error: 'Invalid credentials' })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ status: false, error: 'Invalid credentials' })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(400).send({ status: true, token })
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message })
  }
};
