import {
  getMeService,
  updateMeService,
  changePasswordService,
} from '../service/meService.js';

export const getMeController = async (req, res, next) => {
  try {
    const user = await getMeService(req.user.id);
    res.status(200).json({ message: 'User fetched successfully.', data: user });
  } catch (err) { next(err); }
};

export const updateMeController = async (req, res, next) => {
  try {
    const user = await updateMeService(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated successfully.', data: user });
  } catch (err) { next(err); }
};

export const changePasswordController = async (req, res, next) => {
  try {
    await changePasswordService(req.user.id, req.body);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};
