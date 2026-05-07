import { Request, Response } from 'express';
import { resourceService } from '../services/resource.service';
import { sendSuccess, sendError, sendServerError, sendNotFound } from '../utils';

export class ResourceController {
  async getAllResources(req: Request, res: Response): Promise<void> {
    try {
      const { category, type } = req.query;
      const resources = await resourceService.getAllResources(
        category as any,
        type as any
      );
      sendSuccess(res, resources);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getResourceById(req: Request, res: Response): Promise<void> {
    try {
      const { resourceId } = req.params;
      const resource = await resourceService.getResourceById(resourceId);
      sendSuccess(res, resource);
    } catch (error) {
      if (error instanceof Error) {
        sendNotFound(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async searchResources(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        sendError(res, 'Termo de busca é obrigatório');
        return;
      }
      const resources = await resourceService.searchResources(q);
      sendSuccess(res, resources);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getEmergencyContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await resourceService.getEmergencyContacts();
      sendSuccess(res, contacts);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const resourceController = new ResourceController();
