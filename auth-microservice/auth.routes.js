// File: src/routes.js
import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { AuthController, enforceBlacklist } from "../modules/auth/auth.js";

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - primary_phone
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               primary_phone:
 *                 type: string
 *                 example: "+201234567890"
 *               secondary_phone:
 *                 type: string
 *                 example: "+201234567891"
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 */
router.post(
  "/register",
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      primary_phone: Joi.string().pattern(/^\+?\d{7,15}$/).required(),
      secondary_phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional(),
      password: Joi.string().min(8).required(),
      role: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { email, primary_phone, secondary_phone, password, role } = req.body;
      const result = await authController.initiateRegistration(
        { email, primary_phone, secondary_phone, password, role },
        req.ip
      );
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email/phone and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneOrEmail
 *               - password
 *               - role
 *             properties:
 *               phoneOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: Joi.object({
      phoneOrEmail: Joi.alternatives().try(
        Joi.string().email(),
        Joi.string().pattern(/^\+?\d{7,15}$/)
      ).required(),
      password: Joi.string().min(8).required(),
      role: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { phoneOrEmail, password, role } = req.body;
      const result = await authController.login(
        phoneOrEmail,
        password,
        role,
        req.ip
      );
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * @swagger
 * /auth/register/verify-otp:
 *   post:
 *     summary: Verify registration OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneOrMail
 *               - emailOtp
 *               - password
 *             properties:
 *               phoneOrMail:
 *                 type: string
 *               emailOtp:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid OTP or input
 */
router.post(
  "/register/verify-otp",
  celebrate({
    [Segments.BODY]: Joi.object({
      phoneOrMail: Joi.string().required(),
      emailOtp: Joi.string().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  async (req, res) => {
    try {
      const { phoneOrMail, emailOtp, password } = req.body;
      const result = await authController.verifyRegistration(
        phoneOrMail,
        emailOtp,
        password,
        req.ip
      );
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

/**
 * @swagger
 * /auth/login/verify-otp:
 *   post:
 *     summary: Verify login OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneOrEmail
 *               - otp
 *               - loginRole
 *             properties:
 *               phoneOrEmail:
 *                 type: string
 *               otp:
 *                 type: string
 *               loginRole:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified, login successful
 *       400:
 *         description: Invalid OTP or input
 */
router.post(
  "/login/verify-otp",
  celebrate({
    [Segments.BODY]: Joi.object({
      phoneOrEmail: Joi.alternatives().try(
        Joi.string().email(),
        Joi.string().pattern(/^\+?\d{7,15}$/)
      ).required(),
      otp: Joi.string().required(),
      loginRole: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { phoneOrEmail, otp, loginRole } = req.body;
      const result = await authController.verifyLoginOTP(phoneOrEmail, otp, loginRole, req.ip);
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

/**
 * @swagger
 * /auth/password-reset/initiate:
 *   post:
 *     summary: Initiate password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *       400:
 *         description: Invalid email
 */
router.post(
  "/password-reset/initiate",
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authController.initiatePasswordReset(email, req.ip);
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

/**
 * @swagger
 * /auth/password-reset/complete:
 *   post:
 *     summary: Complete password reset
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneOrMail
 *               - otp
 *               - newPassword
 *             properties:
 *               phoneOrMail:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or input
 */
router.post(
  "/password-reset/complete",
  celebrate({
    [Segments.BODY]: Joi.object({
      phoneOrMail: Joi.string().required(),
      otp: Joi.string().required(),
      newPassword: Joi.string().min(8).required(),
    }),
  }),
  async (req, res) => {
    try {
      const { phoneOrMail, otp, newPassword } = req.body;
      const result = await authController.completePasswordReset(
        phoneOrMail,
        otp,
        newPassword,
        req.ip
      );
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       400:
 *         description: Invalid refresh token
 */
router.post(
  "/token/refresh",
  celebrate({
    [Segments.BODY]: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const result = await authController.refreshToken(refreshToken, req.ip);
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(401).json({ error: e.message });
    }
  }
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *             properties:
 *               uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Invalid UID
 */
router.post(
  "/logout",
  celebrate({
    [Segments.BODY]: Joi.object({
      uid: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const { uid } = req.body;
      const result = await authController.logout(uid, req.ip);
      if (result.status && result.status !== 200) {
        return res.status(result.status).json(result);
      }
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

export default router;
