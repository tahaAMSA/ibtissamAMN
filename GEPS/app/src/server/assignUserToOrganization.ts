import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ID de l'organisation par défaut
const DEFAULT_ORGANIZATION_ID = '75869652-79f9-4f60-9115-e8bc55fec4be';

export async function assignUserToDefaultOrganization(userId: string) {
  try {
    // Vérifier si l'utilisateur a déjà une organisation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé:', userId);
      return;
    }

    if (user.organizationId) {
      console.log('✅ Utilisateur déjà assigné à une organisation');
      return;
    }

    // Assigner à l'organisation par défaut
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: DEFAULT_ORGANIZATION_ID }
    });

    console.log('✅ Utilisateur assigné à l\'organisation par défaut:', userId);
  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation:', error);
  }
}

// Script pour assigner tous les utilisateurs sans organisation
export async function assignAllUsersToDefaultOrganization() {
  try {
    const usersWithoutOrg = await prisma.user.findMany({
      where: { organizationId: null },
      select: { id: true, email: true }
    });

    console.log(`Trouvé ${usersWithoutOrg.length} utilisateurs sans organisation`);

    for (const user of usersWithoutOrg) {
      await assignUserToDefaultOrganization(user.id);
      console.log(`✅ Assigné: ${user.email}`);
    }

    console.log('✅ Tous les utilisateurs ont été assignés');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  assignAllUsersToDefaultOrganization();
}
