const UserSchema = require('../Module/UserSchem')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { sendmail } = require('../Nodemailer/Mail')


exports.UserCreate = async (req, res) => {
  try {
    const data = req.body;
    const { name, email, password } = data;
    // const ProfileImg = req.file ? req.file.path : undefined;

    if (!name) return res.status(400).send({ status: false, msg: 'please provide a name ' });
    if (!email) return res.status(400).send({ status: false, msg: 'please provide a email ' });
    if (!password) return res.status(400).send({ status: false, msg: 'please provide a password ' });
    // if (!ProfileImg) return res.status(400).send({ status: false, msg: 'Image is required ' });

    const Finduser = await UserSchema.findOne({ email: email });

    if (Finduser) {
      if (Finduser.isverify === true) {
        return res.status(400).send({ status: false, msg: 'please verify first' });
      }
      if (Finduser.isdelete === true) {
        return res.status(400).send({ status: false, msg: 'your account is deleted' });
      }
      return res.status(400).send({ status: false, msg: 'You already exist' });
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000);

    await sendmail(name, email, randomOtp);

    const bcryptPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSchema.create({
      name,
      email,
      password: bcryptPassword,
      otp: randomOtp
    });

    return res.status(200).send({ user: newUser, status: true, msg: 'user created successfully ' });

  } catch (e) {
    return res.status(500).send({ status: false, msg: e.message });
  }
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



exports.userdelete = async (req, res) => {
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


exports.verifyotp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!id) {
      return res.status(400).send({ status: false, msg: 'id is required' });
    }
    if (!otp) {
      return res.status(400).send({ status: false, msg: 'otp is required' });
    }

    const checkuser = await UserSchema.findById(id);

    if (!checkuser) {
      return res.status(400).send({ status: false, msg: 'user not found' });
    }

    if (checkuser.isverify === true) {
      return res.status(400).send({ status: false, msg: 'you are already verified please login ' });
    }
    if (checkuser.isdelete === true) {
      return res.status(400).send({ status: false, msg: 'you account is deleted please contact admin' });
    }


    if (checkuser.otp !== otp) {
      return res.status(400).send({ status: false, msg: 'wrong otp' });
    }

    await UserSchema.findByIdAndUpdate(id, { isverify: true }, { new: true });
    await checkuser.save();
    return res.status(200).send({ status: true, msg: 'OTP verified successfully' });
  } catch (e) {
    return res.status(500).send({ status: false, message: e.message });
  }
};