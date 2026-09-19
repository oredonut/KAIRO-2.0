import { Request, Response } from 'express';
import { MatchingService } from './matching.service';
import { sendSuccess, sendError } from '../../utils/response';

export class MatchingController {
  static async findProfessionals(req: Request, res: Response) {
    try {
      const { problemRequestId, latitude, longitude, maxRadiusKm } = req.body;

      if (!problemRequestId) {
        return sendError(res, 'problemRequestId is required for matching.');
      }

      const matches = await MatchingService.findMatchingProfessionals(
        problemRequestId,
        latitude ? Number(latitude) : undefined,
        longitude ? Number(longitude) : undefined,
        maxRadiusKm ? Number(maxRadiusKm) : 35
      );

      return sendSuccess(
        res,
        {
          problemRequestId,
          matchedCount: matches.length,
          professionals: matches,
        },
        'Matching professionals found and ranked by composite trust score.'
      );
    } catch (err: any) {
      return sendError(res, err.message || 'Matching process failed.', 500);
    }
  }
}
