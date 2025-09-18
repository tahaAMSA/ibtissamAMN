import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultOrganization() {
  try {
    // Vérifier si l'organisation existe déjà
    const existingOrg = await prisma.organization.findUnique({
      where: { id: 'default-org-id' }
    });

    if (existingOrg) {
      console.log('✅ Organisation par défaut existe déjà');
      return;
    }

    // Créer l'organisation par défaut
    const defaultOrg = await prisma.organization.create({
      data: {
        id: 'default-org-id',
        name: 'Organisation par défaut',
        slug: 'default-org',
        adminEmail: 'admin@geps.ma',
        status: 'ACTIVE',
        plan: 'FREE',
        maxUsers: 50,
        maxBeneficiaries: 100,
        maxStorage: 1000000000, // 1GB
      }
    });

    console.log('✅ Organisation par défaut créée:', defaultOrg.name);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'organisation par défaut:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  createDefaultOrganization();
}

export { createDefaultOrganization };
