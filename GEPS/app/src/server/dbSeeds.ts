import type { DbSeedFn } from 'wasp/server'
import type { PrismaClient } from 'wasp/server'

export const createDefaultOrganization: DbSeedFn = async (prisma) => {
  // Vérifier si l'organisation par défaut existe déjà
  const existingOrg = await prisma.organization.findUnique({
    where: { slug: 'geps-demo' }
  });

  if (existingOrg) {
    console.log('✅ Organisation par défaut existe déjà:', existingOrg.name);
    return;
  }

  // Créer l'organisation par défaut
  const defaultOrg = await prisma.organization.create({
    data: {
      name: 'GEPS Demo',
      slug: 'geps-demo',
      adminEmail: 'admin@geps.ma',
      status: 'ACTIVE',
      plan: 'FREE',
      maxUsers: 50,
      maxBeneficiaries: 100,
      maxStorage: 1000000000, // 1GB
    }
  });

  console.log('✅ Organisation par défaut créée:', defaultOrg.name);
  console.log('   ID:', defaultOrg.id);
  console.log('   Slug:', defaultOrg.slug);
};
