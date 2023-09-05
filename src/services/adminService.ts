import * as Type from "../types/type";
import { AdminRepository } from "../models/repositories/admin.repository";

export const createPopup = async (popupData: Type.Popup) => {
  try {
    const popup = await AdminRepository.createPopup(popupData);
    return popup;
  } catch (error) {
    throw error;
  }
};
