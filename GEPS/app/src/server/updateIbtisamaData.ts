import type { DbSeedFn } from 'wasp/server'
import type { PrismaClient } from 'wasp/server'
import { Gender } from '@prisma/client'

export const updateIbtisamaData: DbSeedFn = async (prisma: PrismaClient) => {
  console.log('🔄 Début de la mise à jour des données Ibtisama...')

  // 1. Mettre à jour les utilisateurs existants
  const usersToUpdate = [
    {
      email: 'admin@ibtisama.ma',
      firstNameAr: 'أمينة',
      lastNameAr: 'بناني',
      phone: '+212661234567',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1985, 3, 15),
    },
    {
      email: 'directeur@ibtisama.ma',
      firstNameAr: 'يوسف',
      lastNameAr: 'العلوي',
      phone: '+212662345678',
      gender: Gender.HOMME,
      dateOfBirth: new Date(1980, 8, 22),
    },
    {
      email: 'coordinateur@ibtisama.ma',
      firstNameAr: 'رشيد',
      lastNameAr: 'التازي',
      phone: '+212663456789',
      gender: Gender.HOMME,
      dateOfBirth: new Date(1978, 11, 8),
    },
    {
      email: 'accueil1@ibtisama.ma',
      firstNameAr: 'فاطمة الزهراء',
      lastNameAr: 'العمراني',
      phone: '+212664567890',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1990, 5, 12),
    },
    {
      email: 'assistante1@ibtisama.ma',
      firstNameAr: 'خديجة',
      lastNameAr: 'السنهاجي',
      phone: '+212665678901',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1987, 2, 28),
    }
  ]

  for (const userData of usersToUpdate) {
    try {
      await prisma.user.update({
        where: { email: userData.email },
        data: {
          firstNameAr: userData.firstNameAr,
          lastNameAr: userData.lastNameAr,
          phone: userData.phone,
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth,
        }
      })
      console.log(`✅ Utilisateur mis à jour: ${userData.email}`)
    } catch (error) {
      console.log(`❌ Erreur lors de la mise à jour de ${userData.email}:`, error)
    }
  }

  // 2. Mettre à jour les bénéficiaires existants
  const beneficiariesToUpdate = [
    {
      firstName: 'Aicha',
      lastName: 'Moussaoui',
      phone: '+212666789012',
      address: 'Hay Nahda, Rabat',
    },
    {
      firstName: 'Fatima Zahra',
      lastName: 'El Mansouri',
      phone: '+212667890123',
      address: 'Agdal, Rabat',
    },
    {
      firstName: 'Khadija',
      lastName: 'Bennani',
      phone: '+212668901234',
      address: 'Hassan, Rabat',
    },
    {
      firstName: 'Zineb',
      lastName: 'Alaoui',
      phone: '+212669012345',
      address: 'Souissi, Rabat',
    },
    {
      firstName: 'Salma',
      lastName: 'Idrissi',
      phone: '+212670123456',
      address: 'Yacoub El Mansour, Rabat',
    },
    {
      firstName: 'Amina',
      lastName: 'Diallo',
      phone: '+212671234567',
      address: 'Takaddoum, Rabat',
    },
    {
      firstName: 'Najat',
      lastName: 'Berrada',
      phone: '+212672345678',
      address: 'Hay Riad, Rabat',
    },
    {
      firstName: 'Malika',
      lastName: 'Fassi',
      phone: '+212673456789',
      address: 'Orangerie, Rabat',
    },
    {
      firstName: 'Yousra',
      lastName: 'Tazi',
      phone: '+212674567890',
      address: 'Aviation, Rabat',
    },
    {
      firstName: 'Hafsa',
      lastName: 'Chraibi',
      phone: '+212675678901',
      address: 'Hay El Fath, Rabat',
    },
    {
      firstName: 'Ahmed',
      lastName: 'Benali',
      phone: '+212676789012',
      address: 'Douar Hajja, Salé',
    },
    {
      firstName: 'Yasmine',
      lastName: 'Ouali',
      phone: '+212677890123',
      address: 'Bettana, Salé',
    },
    {
      firstName: 'Omar',
      lastName: 'Kettani',
      phone: '+212678901234',
      address: 'Laayayda, Salé',
    },
    {
      firstName: 'Lina',
      lastName: 'Fassi',
      phone: '+212679012345',
      address: 'Chmaou, Salé',
    },
    {
      firstName: 'Karim',
      lastName: 'Alami',
      phone: '+212680123456',
      address: 'Hay Karima, Salé',
    }
  ]

  for (const benefData of beneficiariesToUpdate) {
    try {
      const updated = await prisma.beneficiary.updateMany({
        where: {
          firstName: benefData.firstName,
          lastName: benefData.lastName,
        },
        data: {
          phone: benefData.phone,
          address: benefData.address,
          nationalite: 'Marocaine',
          nomComplet: `${benefData.firstName} ${benefData.lastName}`,
        }
      })
      
      if (updated.count > 0) {
        console.log(`✅ Bénéficiaire mis à jour: ${benefData.firstName} ${benefData.lastName}`)
      } else {
        console.log(`⚠️  Bénéficiaire non trouvé: ${benefData.firstName} ${benefData.lastName}`)
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la mise à jour de ${benefData.firstName} ${benefData.lastName}:`, error)
    }
  }

  console.log('🎉 Mise à jour des données Ibtisama terminée!')
}
