import * as type from "../types/type";
import { AdminRepository } from "../models/repositories/admin.repository";

export const createCategory = async (category: type.Category) => {
  try {
    await AdminRepository.createCategory(category);
  } catch (error) {
    throw error;
  }
};
