import {
  getMeService,
  updateMeService,
  changePasswordService,
} from '../service/meService.js';

export const getMeController = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);
    res.status(200).json({ message: 'User fetched successfully.', data: user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const updateMeController = async (req, res) => {
  try {
    const user = await updateMeService(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated successfully.', data: user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    await changePasswordService(req.user.id, req.body);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};
