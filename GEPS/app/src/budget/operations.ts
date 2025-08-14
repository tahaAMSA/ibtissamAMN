import { HttpError } from 'wasp/server';
import type {
  GetAllBudgets,
  CreateBudget,
  UpdateBudget,
  DeleteBudget,
  CreateExpense,
  CreateRevenue
} from 'wasp/server/operations';
import type { Budget, Expense, Revenue } from 'wasp/entities';

// Types
type CreateBudgetInput = {
  module: string;
  year: number;
  initialAmount: number;
  description?: string;
};

type UpdateBudgetInput = {
  id: string;
  module?: string;
  year?: number;
  initialAmount?: number;
  usedAmount?: number;
  description?: string;
};

type CreateExpenseInput = {
  budgetId: string;
  label: string;
  amount: number;
  date: string;
  category?: string;
  justification?: string;
};

type CreateRevenueInput = {
  budgetId: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
};

// Get all budgets
export const getAllBudgets: GetAllBudgets<void, Budget[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  try {
    return await context.entities.Budget.findMany({
      orderBy: [
        { year: 'desc' },
        { module: 'asc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        expenses: {
          orderBy: {
            date: 'desc'
          },
          take: 5
        },
        revenues: {
          orderBy: {
            date: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            expenses: true,
            revenues: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des budgets:', error);
    throw new HttpError(500, 'Erreur serveur lors de la récupération des budgets');
  }
};

// Create new budget
export const createBudget: CreateBudget<CreateBudgetInput, Budget> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations (seuls les admins et financiers peuvent créer des budgets)
  if (!['ADMIN', 'FINANCIAL'].includes(context.user.role)) {
    throw new HttpError(403, 'Seuls les administrateurs et le personnel financier peuvent créer des budgets');
  }

  // Validation des champs requis
  if (!args.module || !args.year || !args.initialAmount) {
    throw new HttpError(400, 'Les champs module, année et montant initial sont obligatoires');
  }

  if (args.initialAmount <= 0) {
    throw new HttpError(400, 'Le montant initial doit être positif');
  }

  try {
    // Vérifier qu'il n'existe pas déjà un budget pour ce module et cette année
    const existingBudget = await context.entities.Budget.findFirst({
      where: {
        module: args.module,
        year: args.year
      }
    });

    if (existingBudget) {
      throw new HttpError(409, 'Un budget existe déjà pour ce module et cette année');
    }

    return await context.entities.Budget.create({
      data: {
        module: args.module.trim(),
        year: args.year,
        initialAmount: args.initialAmount,
        usedAmount: 0,
        description: args.description?.trim(),
        userId: context.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        _count: {
          select: {
            expenses: true,
            revenues: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création du budget:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création du budget');
  }
};

// Update budget
export const updateBudget: UpdateBudget<UpdateBudgetInput, Budget> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations
  if (!['ADMIN', 'FINANCIAL'].includes(context.user.role)) {
    throw new HttpError(403, 'Seuls les administrateurs et le personnel financier peuvent modifier des budgets');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du budget requis');
  }

  try {
    // Vérifier que le budget existe
    const existingBudget = await context.entities.Budget.findUnique({
      where: { id: args.id }
    });

    if (!existingBudget) {
      throw new HttpError(404, 'Budget non trouvé');
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (args.module !== undefined) updateData.module = args.module.trim();
    if (args.year !== undefined) updateData.year = args.year;
    if (args.initialAmount !== undefined) {
      if (args.initialAmount <= 0) {
        throw new HttpError(400, 'Le montant initial doit être positif');
      }
      updateData.initialAmount = args.initialAmount;
    }
    if (args.usedAmount !== undefined) updateData.usedAmount = args.usedAmount;
    if (args.description !== undefined) updateData.description = args.description?.trim();

    return await context.entities.Budget.update({
      where: { id: args.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        _count: {
          select: {
            expenses: true,
            revenues: true
          }
        }
      }
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du budget:', error);
    throw new HttpError(500, 'Erreur serveur lors de la mise à jour du budget');
  }
};

// Delete budget
export const deleteBudget: DeleteBudget<{ id: string }, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations (seuls les admins peuvent supprimer)
  if (context.user.role !== 'ADMIN') {
    throw new HttpError(403, 'Seuls les administrateurs peuvent supprimer des budgets');
  }

  if (!args.id) {
    throw new HttpError(400, 'ID du budget requis');
  }

  try {
    // Vérifier que le budget existe
    const existingBudget = await context.entities.Budget.findUnique({
      where: { id: args.id },
      include: {
        expenses: true,
        revenues: true
      }
    });

    if (!existingBudget) {
      throw new HttpError(404, 'Budget non trouvé');
    }

    // Vérifier s'il y a des dépenses ou revenus associés
    if (existingBudget.expenses.length > 0 || existingBudget.revenues.length > 0) {
      throw new HttpError(409, 'Impossible de supprimer un budget qui contient des dépenses ou des revenus');
    }

    // Suppression physique du budget
    await context.entities.Budget.delete({
      where: { id: args.id }
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du budget:', error);
    throw new HttpError(500, 'Erreur serveur lors de la suppression du budget');
  }
};

// Create expense
export const createExpense: CreateExpense<CreateExpenseInput, Expense> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations
  if (!['ADMIN', 'FINANCIAL'].includes(context.user.role)) {
    throw new HttpError(403, 'Seuls les administrateurs et le personnel financier peuvent créer des dépenses');
  }

  // Validation des champs requis
  if (!args.budgetId || !args.label || !args.amount || !args.date) {
    throw new HttpError(400, 'Les champs budget, libellé, montant et date sont obligatoires');
  }

  if (args.amount <= 0) {
    throw new HttpError(400, 'Le montant doit être positif');
  }

  try {
    // Vérifier que le budget existe
    const budget = await context.entities.Budget.findUnique({
      where: { id: args.budgetId }
    });

    if (!budget) {
      throw new HttpError(404, 'Budget non trouvé');
    }

    // Vérifier que la dépense ne dépasse pas le budget disponible
    const remainingBudget = budget.initialAmount - budget.usedAmount;
    if (args.amount > remainingBudget) {
      throw new HttpError(400, `Dépense supérieure au budget disponible (${remainingBudget} DH restants)`);
    }

    const expense = await context.entities.Expense.create({
      data: {
        label: args.label.trim(),
        amount: args.amount,
        date: new Date(args.date),
        category: args.category?.trim(),
        justification: args.justification?.trim(),
        budgetId: args.budgetId,
        userId: context.user.id
      },
      include: {
        budget: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Mettre à jour le montant utilisé du budget
    await context.entities.Budget.update({
      where: { id: args.budgetId },
      data: {
        usedAmount: budget.usedAmount + args.amount
      }
    });

    return expense;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création de la dépense:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création de la dépense');
  }
};

// Create revenue
export const createRevenue: CreateRevenue<CreateRevenueInput, Revenue> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Non autorisé');
  }

  // Vérifier les autorisations
  if (!['ADMIN', 'FINANCIAL'].includes(context.user.role)) {
    throw new HttpError(403, 'Seuls les administrateurs et le personnel financier peuvent créer des revenus');
  }

  // Validation des champs requis
  if (!args.budgetId || !args.source || !args.amount || !args.date) {
    throw new HttpError(400, 'Les champs budget, source, montant et date sont obligatoires');
  }

  if (args.amount <= 0) {
    throw new HttpError(400, 'Le montant doit être positif');
  }

  try {
    // Vérifier que le budget existe
    const budget = await context.entities.Budget.findUnique({
      where: { id: args.budgetId }
    });

    if (!budget) {
      throw new HttpError(404, 'Budget non trouvé');
    }

    const revenue = await context.entities.Revenue.create({
      data: {
        source: args.source.trim(),
        amount: args.amount,
        date: new Date(args.date),
        description: args.description?.trim(),
        budgetId: args.budgetId,
        userId: context.user.id
      },
      include: {
        budget: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Mettre à jour le montant initial du budget (ajouter le revenu)
    await context.entities.Budget.update({
      where: { id: args.budgetId },
      data: {
        initialAmount: budget.initialAmount + args.amount
      }
    });

    return revenue;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Erreur lors de la création du revenu:', error);
    throw new HttpError(500, 'Erreur serveur lors de la création du revenu');
  }
};
