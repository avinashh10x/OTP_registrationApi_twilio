const User = require('../models/userModel');
const twilio = require('twilio');
const generateToken = require('../utils/jwt');

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const SERVICE_SID = process.env.TWILIO_SERVICE_SID;
const twilioClient = twilio(ACCOUNT_SID, AUTH_TOKEN);

const register = async (req, res) => {
  const { phoneNumber } = req.body;
  const number = phoneNumber.trim()

  try {
    // send OTP using Twilio

    const verification = await twilioClient.verify.v2
      .services(SERVICE_SID)
      .verifications.create({ to: number, channel: 'sms' });

    res.status(200).json({
      message: `OTP sent to ${number}`,
      status: verification.status,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};

// console.log('Twilio Service SID:', SERVICE_SID);



const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  try {
    const verificationCheck = await twilioClient.verify.v2
      .services(SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status === 'approved') {
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        user = new User({ phoneNumber, verified: true });
        await user.save();
      } else {
        user.verified = true;
        await user.save();
      }

      const token = generateToken(user._id);

      await twilioClient.messages.create({
        body: 'Your phone number has been verified successfully',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return res.status(200).json({
        message: 'Phone number verified and user saved successfully',
        token: token,
      });
    }

    res.status(400).json({ message: 'Invalid or expired OTP' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to verify OTP',
      error: error.message,
    });
  }
};




module.exports = { register, verifyOtp };
