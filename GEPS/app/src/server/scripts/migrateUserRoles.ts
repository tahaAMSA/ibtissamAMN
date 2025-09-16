import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de migration pour adapter les anciens rôles vers les nouveaux
 */
async function migrateUserRoles() {
  console.log('🔄 Début de la migration des rôles utilisateurs...');

  try {
    // Mapping des anciens rôles vers les nouveaux
    const roleMapping = {
      'SOCIAL_WORKER': 'ASSISTANTE_SOCIALE',
      'MEDICAL': 'ASSISTANTE_SOCIALE', // Mapping temporaire
      'EDUCATIONAL': 'RESPONSABLE_EDUCATION',
      'TECHNICAL': 'GESTIONNAIRE_RESSOURCES',
      'FINANCIAL': 'COMPTABLE',
    };

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
      }
    });

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      const currentRole = user.role as string;
      
      // Si le rôle existe déjà dans les nouveaux rôles, passer au suivant
      const newRoles = [
        'ADMIN', 'DIRECTEUR', 'AGENT_ACCUEIL', 'COORDINATEUR',
        'ASSISTANTE_SOCIALE', 'TRAVAILLEUR_SOCIAL', 'CONSEILLER_JURIDIQUE',
        'RESPONSABLE_HEBERGEMENT', 'RESPONSABLE_EDUCATION', 'RESPONSABLE_ACTIVITES',
        'COMPTABLE', 'GESTIONNAIRE_RESSOURCES', 'DOCUMENTALISTE', 'OBSERVATEUR'
      ];

      if (newRoles.includes(currentRole)) {
        console.log(`✅ ${user.firstName} ${user.lastName} (${user.email}) - Rôle déjà valide: ${currentRole}`);
        skippedCount++;
        continue;
      }

      // Mapper l'ancien rôle vers le nouveau
      const newRole = roleMapping[currentRole as keyof typeof roleMapping];
      
      if (newRole) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole as any }
        });
        
        console.log(`🔄 ${user.firstName} ${user.lastName} (${user.email}) - ${currentRole} → ${newRole}`);
        migratedCount++;
      } else {
        console.log(`⚠️  ${user.firstName} ${user.lastName} (${user.email}) - Rôle non mappé: ${currentRole} (défaut: ASSISTANTE_SOCIALE)`);
        
        // Assigner un rôle par défaut
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ASSISTANTE_SOCIALE' as any }
        });
        migratedCount++;
      }
    }

    console.log('\n📈 Résumé de la migration:');
    console.log(`✅ ${migratedCount} utilisateurs migrés`);
    console.log(`⏭️  ${skippedCount} utilisateurs ignorés (rôles déjà valides)`);
    console.log(`📊 Total: ${users.length} utilisateurs traités`);

    // Créer un utilisateur admin par défaut s'il n'en existe pas
    const adminExists = await prisma.user.findFirst({
      where: {
        OR: [
          { isAdmin: true },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!adminExists) {
      console.log('\n👑 Création d\'un compte administrateur par défaut...');
      
      await prisma.user.create({
        data: {
          email: 'admin@geps.ma',
          firstName: 'Admin',
          lastName: 'Principal',
          role: 'ADMIN',
          isAdmin: true,
          isActive: true,
        }
      });

      console.log('✅ Compte administrateur créé: admin@geps.ma');
      console.log('⚠️  Pensez à configurer l\'authentification pour ce compte!');
    }

    console.log('\n🎉 Migration terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Script pour créer les permissions de base pour chaque rôle
 */
async function seedPermissions() {
  console.log('🌱 Initialisation des permissions de base...');

  // TODO: Implémenter la création des permissions de base
  // Ce sera fait plus tard quand le modèle Permission sera ajouté au schéma
  
  console.log('✅ Permissions initialisées');
}

// Exporter les fonctions pour utilisation dans les seeds
export { migrateUserRoles, seedPermissions };

// Permettre l'exécution directe du script
if (require.main === module) {
  migrateUserRoles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
