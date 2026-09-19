import { Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { SavedProfessional } from '../../types/index';

export class SavedProfessionalsController {
  static async toggleSave(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id;
      const { professionalId } = req.body;

      if (!professionalId) {
        return sendError(res, 'professionalId is required.');
      }

      const query = await db
        .collection('saved_professionals')
        .where('customerId', '==', customerId)
        .where('professionalId', '==', professionalId)
        .get();

      if (!query.empty) {
        // Unsave / remove bookmark
        const docId = query.docs[0].id;
        await db.collection('saved_professionals').doc(docId).delete();
        return sendSuccess(res, { isSaved: false }, 'Professional removed from saved list.');
      } else {
        // Save professional
        const id = 'sp_' + Date.now();
        const item: SavedProfessional = {
          id,
          customerId: customerId!,
          professionalId,
          createdAt: new Date().toISOString(),
        };
        await db.collection('saved_professionals').doc(id).set(item);
        return sendSuccess(res, { isSaved: true, saved: item }, 'Professional saved successfully.', 201);
      }
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to toggle saved professional.', 500);
    }
  }

  static async getMySaved(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.id;
      const snapshot = await db.collection('saved_professionals').where('customerId', '==', customerId).get();
      const items: SavedProfessional[] = snapshot.docs.map((doc: any) => doc.data());

      // Fetch professional profiles for each item
      const profs = [];
      for (const item of items) {
        const pDoc = await db.collection('professional_profiles').doc(item.professionalId).get();
        if (pDoc.exists) {
          profs.push(pDoc.data());
        }
      }

      return sendSuccess(res, profs, 'Saved professionals retrieved.');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch saved professionals.', 500);
    }
  }
}
