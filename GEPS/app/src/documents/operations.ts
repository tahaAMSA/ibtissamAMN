import { HttpError } from 'wasp/server';
import type {
  GetAllDocuments,
  CreateDocument,
  UpdateDocument,
  DeleteDocument
} from 'wasp/server/operations';
import type { Document } from 'wasp/entities';
import { DocumentType, DocumentStatus } from '@prisma/client';

// Types
type CreateDocumentInput = {
  type: DocumentType;
  content: string;
  date: string;
  beneficiaryId: string;
  status?: DocumentStatus;
};

type UpdateDocumentInput = {
  id: string;
  type?: DocumentType;
  content?: string;
  date?: string;
  status?: DocumentStatus;
};

// Get all documents
export const getAllDocuments: GetAllDocuments<void, Document[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Document.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des documents');
  }
};

// Create new document
export const createDocument: CreateDocument<CreateDocumentInput, Document> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Validation des champs requis
  if (!args.type || !args.content || !args.date || !args.beneficiaryId) {
    throw new HttpError(400, 'Les champs type, contenu, date et bénéficiaire sont obligatoires');
  }

  try {
    // Vérifier que le bénéficiaire existe
    const beneficiary = await context.entities.Beneficiary.findUnique({
      where: { id: args.beneficiaryId }
    });

    if (!beneficiary) {
      throw new HttpError(404, 'Bénéficiaire non trouvé');
    }

    return await context.entities.Document.create({
      data: {
        type: args.type,
        content: args.content.trim(),
        date: new Date(args.date),
        status: args.status || DocumentStatus.ACTIVE,
        beneficiaryId: args.beneficiaryId,
        userId: context.user.id
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création du document:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création du document');
  }
};

// Update document
export const updateDocument: UpdateDocument<UpdateDocumentInput, Document> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du document requis');
  }

  try {
    // Vérifier que le document existe
    const existingDocument = await context.entities.Document.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingDocument) {
      throw new HttpError(404, 'Document non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut modifier)
    if (existingDocument.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à modifier ce document');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.type !== undefined) updateData.type = args.type;
    if (args.content !== undefined) updateData.content = args.content.trim();
    if (args.date !== undefined) updateData.date = new Date(args.date);
    if (args.status !== undefined) updateData.status = args.status;

    return await context.entities.Document.update({
      where: { id: args.id },
      data: updateData,
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du document:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du document');
  }
};

// Delete document
export const deleteDocument: DeleteDocument<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du document requis');
  }

  try {
    // Vérifier que le document existe
    const existingDocument = await context.entities.Document.findUnique({
      where: { id: args.id },
      include: {
        user: true
      }
    });

    if (!existingDocument) {
      throw new HttpError(404, 'Document non trouvé');
    }

    // Vérifier les autorisations (seul le créateur ou un admin peut supprimer)
    if (existingDocument.userId !== context.user.id && context.user.role !== 'ADMIN') {
      throw new HttpError(403, 'Vous n\'êtes pas autorisé à supprimer ce document');
    }

    // Suppression physique du document
    await context.entities.Document.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du document:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du document');
  }
};
