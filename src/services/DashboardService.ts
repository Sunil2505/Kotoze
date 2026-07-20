import DashboardRepository from "@/repositories/DashboardRepository";
import { DashboardOverview } from "@/types/dashboard";

export default class DashboardService {
  /**
   * Get Dashboard Overview
   */
  static async getOverview(): Promise<DashboardOverview> {
    try {
      const overview = await DashboardRepository.getDashboardOverview();

      return overview;
    } catch (error) {
      console.error("DashboardService.getOverview()", error);
      throw error;
    }
  }
}