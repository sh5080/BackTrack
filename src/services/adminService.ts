import * as type from "../types/type";
import { AdminRepository } from "../models/repositories/admin.repository";

export const createDescription = async (description: type.Description) => {
  try {
    await AdminRepository.createDescription(description);
  } catch (error) {
    throw error;
  }
};
