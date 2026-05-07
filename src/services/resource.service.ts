import { prisma } from '../config';
import { ResourceType, ResourceCategory } from '@prisma/client';

export class ResourceService {
  async getAllResources(category?: ResourceCategory, type?: ResourceType) {
    const where: any = { isActive: true };

    if (category) where.category = category;
    if (type) where.type = type;

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return resources;
  }

  async getResourceById(resourceId: string) {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || !resource.isActive) {
      throw new Error('Recurso não encontrado');
    }

    return resource;
  }

  async getResourcesByCategory(category: ResourceCategory) {
    const resources = await prisma.resource.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return resources;
  }

  async getResourcesByType(type: ResourceType) {
    const resources = await prisma.resource.findMany({
      where: {
        type,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return resources;
  }

  async searchResources(query: string) {
    const resources = await prisma.resource.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query.toLowerCase()] } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return resources;
  }

  async getEmergencyContacts() {
    const contacts = await prisma.emergencyContact.findMany({
      where: { isActive: true },
      orderBy: { type: 'asc' },
    });

    return contacts;
  }
}

export const resourceService = new ResourceService();
