import * as type from "../types/type";
import { AdminRepository } from "../models/repositories/admin.repository";

export const createPopup = async (popupData: type.Popup) => {
  try {
    await AdminRepository.createPopup(popupData);
  } catch (error) {
    throw error;
  }
};
