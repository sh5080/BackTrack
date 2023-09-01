import * as Type from "../../types/type";
import { AdminEntity } from "../entities/admin.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const AdminRepository = AppDataSource.getRepository(AdminEntity).extend({
  async createDescription(description: Type.Description) {
    try {
      // const { description, details } = description;

      const descriptionData = this.create({
        description,
        details,
      });

      await this.save(descriptionData);
      return descriptionData;
    } catch (error) {
      throw error;
    }
  },
});
