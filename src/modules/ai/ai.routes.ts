import { Router, Request, Response } from 'express';
import { AIService } from './ai.service';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();

router.post('/analyze-problem', async (req: Request, res: Response) => {
  try {
    const { input } = req.body;
    if (!input) return sendError(res, 'Input string is required.');
    const result = await AIService.analyzeProblem(input);
    return sendSuccess(res, result, 'AI analysis complete.');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

router.post('/parse-artisan', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) return sendError(res, 'Description string is required.');
    const result = await AIService.parseArtisanProfile(description);
    return sendSuccess(res, result, 'Artisan profile parsed.');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
