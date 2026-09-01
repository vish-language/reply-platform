import { Request, Response } from "express";

import { AnalyticsService }
from "../services/analytics.service.js";


export class AnalyticsController {


  static async dashboard(
    req: Request,
    res: Response,
  ) {

    try {

      const organizationId =
        req.user.organizationId;


      const stats =
        await AnalyticsService.getDashboardStats(
          organizationId,
        );


      return res.json({

        success: true,

        data: stats,

      });


    } catch(error) {

      console.error(error);


      return res.status(500).json({

        success:false,

        message:
          "Failed to fetch analytics",

      });

    }

  }

}