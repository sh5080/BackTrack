import * as type from "../types/type";
import { AuthRepository } from "../models/repositories/admin.repository";

export const createCategory = async (category: type.Category) => {
  try {
    await AuthRepository.createCategory(category);
  } catch (error) {
    throw error;
  }
};
