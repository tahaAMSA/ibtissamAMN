import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserProfiles() {
  console.log('🔄 Mise à jour des profils utilisateurs...');

  try {
    // Exemples d'utilisateurs avec des noms en français et en arabe
    const userUpdates = [
      {
        email: 'admin@geps.ma',
        firstName: 'Ahmed',
        lastName: 'Benali',
        firstNameAr: 'أحمد',
        lastNameAr: 'بن علي',
        gender: 'HOMME' as const,
        phone: '+212612345678'
      },
      {
        email: 'directeur@geps.ma',
        firstName: 'Fatima',
        lastName: 'Zahra',
        firstNameAr: 'فاطمة',
        lastNameAr: 'الزهراء',
        gender: 'FEMME' as const,
        phone: '+212698765432'
      },
      {
        email: 'accueil@geps.ma',
        firstName: 'Mohamed',
        lastName: 'Alami',
        firstNameAr: 'محمد',
        lastNameAr: 'العلمي',
        gender: 'HOMME' as const,
        phone: '+212687654321'
      },
      {
        email: 'assistante@geps.ma',
        firstName: 'Aicha',
        lastName: 'Benjelloun',
        firstNameAr: 'عائشة',
        lastNameAr: 'بن جلون',
        gender: 'FEMME' as const,
        phone: '+212676543210'
      }
    ];

    for (const userData of userUpdates) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            firstNameAr: userData.firstNameAr,
            lastNameAr: userData.lastNameAr,
            gender: userData.gender,
            phone: userData.phone,
            dateOfBirth: new Date('1990-01-01') // Date de naissance par défaut
          }
        });
        
        console.log(`✅ Utilisateur mis à jour: ${userData.firstName} ${userData.lastName} (${userData.firstNameAr} ${userData.lastNameAr})`);
      } else {
        console.log(`⚠️  Utilisateur non trouvé: ${userData.email}`);
      }
    }

    console.log('✅ Mise à jour des profils utilisateurs terminée !');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des profils utilisateurs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  updateUserProfiles()
    .then(() => {
      console.log('Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur lors de l\'exécution du script:', error);
      process.exit(1);
    });
}

export { updateUserProfiles };
