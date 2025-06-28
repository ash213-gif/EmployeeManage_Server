const UserSchema = require('../Module/UserSchem')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const {sendmail} = require('../Nodemailer/Mail')


exports.UserCreate = async (req, res) => {
  try {
    const data = req.body;
    const { name, email, password } = data;

    if (!name) { return res.status(400).send({ status: false, msg: 'please provide a name ' }) }
    if (!email) { return res.status(400).send({ status: false, msg: 'please provide a email ' }) }
    if (!password) { return res.status(400).send({ status: false, msg: 'please provide a password ' }) }

    const Finduser = await UserSchema.find({ email: email })

    if (Finduser.isverify === true) { return res.status(400).send({ status: false, msg: 'you are alreadyy exits ' }) }
    if (Finduser.isdelete === true) { return res.status(400).send({ status: false, msg: 'you accounst is deleted  ' }) }

    const randomOtp=  await  Math.floor(100000 + Math.random() * 900000);
    data.otp = randomOtp;
    await sendmail(name, email, randomOtp);

    const bcryptPassword = await bcrypt.hash(password, 10)
    data.password = bcryptPassword

  
    const newdata = await UserSchema.create(data)

    return res.status(200).send({ user: newdata, status: true, msg: 'user created successfully ' })

  } catch (e) { return res.status(500).send({ status: false, msg: e.message }) }

}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: 'you are not exists ' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'invailed password' });
    }

    if (!user.isverify) {
      return res.status(401).json({ message: 'User not verified' });
    }

    const token = jwt.sign({ Userid: user._id }, process.env.SECRET_KEY, { expiresIn: '12h' });

    return res.status(200).send({ token, status: true, msg: ' login succesfully' })
  } catch (e) { return res.status(500).send({ status: false, msg: e.message }) }
}



exports.userdelete= async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id);

    if (!user) {
      return res.status(404).send({ status: false, msg: 'User not found' });
    }

    user.isdelete = true;
    await user.save();

    return res.status(200).send({ status: true, msg: 'User deleted successfully' });
  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
}

const mongoose = require('mongoose');

exports.verifyotp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    console.log('Received id:', id);

    if (!id) {
      return res.status(400).send({ status: false, msg: 'id is required' });
    }
    if (!otp) {
      return res.status(400).send({ status: false, msg: 'otp is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ status: false, msg: 'Invalid user id' });
    }

    const checkuser = await UserSchema.findById(id);
    console.log('User:', checkuser);

    if (!checkuser) {
      return res.status(400).send({ status: false, msg: 'user not found' });
    }

    if (String(checkuser.otp) !== String(otp)) {
      return res.status(400).send({ status: false, msg: 'wrong otp' });
    }

    checkuser.isverify = true;
    await checkuser.save();

    return res.status(200).send({ status: true, msg: 'OTP verified successfully' });
  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
};