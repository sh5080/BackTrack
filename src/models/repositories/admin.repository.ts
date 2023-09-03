import * as Type from "../../types/type";
import { AdminEntity } from "../entities/admin.entity";
import { AppDataSource } from "../../loaders/dbLoader";
import { AppError, CommonError } from "../../types/AppError";
export const AdminRepository = AppDataSource.getRepository(AdminEntity).extend({
  async createPopup(popupData: Type.Popup) {
    try {
      const descriptionData = this.create({
        description: popupData.description,
        image: popupData.image,
      });

      await this.save(descriptionData);
      return descriptionData;
    } catch (error) {
      throw error;
    }
  },
});
