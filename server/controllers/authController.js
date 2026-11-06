import { registerService, loginService } from '../service/authService.js';

export const registerController = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ message: 'User registered successfully.', data: result });
  } catch (err) { next(err); }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({ message: 'Login successful.', data: result });
  } catch (err) { next(err); }
};
