import { Response } from 'express';
import { db } from '../../config/firebase';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';

export class UsersController {
  static async updateLocation(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { location, latitude, longitude } = req.body;

      if (latitude === undefined || longitude === undefined) {
        return sendError(res, 'Latitude and longitude are required.');
      }

      const updateData = {
        location: location || '',
        latitude: Number(latitude),
        longitude: Number(longitude),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('users').doc(userId).update(updateData);

      // If user is a professional, update professional location as well
      const profQuery = await db.collection('professional_profiles').where('userId', '==', userId).get();
      if (!profQuery.empty) {
        const profId = profQuery.docs[0].id;
        await db.collection('professional_profiles').doc(profId).update(updateData);
      }

      return sendSuccess(res, updateData, 'User location updated successfully.');
    } catch (err: any) {
      return sendError(res, err.message || 'Location update failed.', 500);
    }
  }
}
