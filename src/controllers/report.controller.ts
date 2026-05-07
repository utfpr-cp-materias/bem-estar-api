import { Response } from 'express';
import { reportService } from '../services/report.service';
import { AuthRequest } from '../middlewares';
import { sendSuccess, sendCreated, sendError, sendServerError, sendNotFound } from '../utils';

export class ReportController {
  async generateWeeklyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const report = await reportService.generateWeeklyReport(req.userId!);
      sendCreated(res, report, 'Relatório semanal gerado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async generateMonthlyReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const report = await reportService.generateMonthlyReport(req.userId!);
      sendCreated(res, report, 'Relatório mensal gerado com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getUserReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, limit } = req.query;
      const reports = await reportService.getUserReports(
        req.userId!,
        type as any,
        limit ? parseInt(limit as string) : 10
      );
      sendSuccess(res, reports);
    } catch (error) {
      sendServerError(res);
    }
  }

  async getReportById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const report = await reportService.getReportById(req.userId!, reportId);
      sendSuccess(res, report);
    } catch (error) {
      if (error instanceof Error) {
        sendNotFound(res, error.message);
        return;
      }
      sendServerError(res);
    }
  }

  async getLatestReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type } = req.query;
      const report = await reportService.getLatestReport(req.userId!, type as any);
      sendSuccess(res, report);
    } catch (error) {
      sendServerError(res);
    }
  }
}

export const reportController = new ReportController();
