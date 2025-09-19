import type { DbSeedFn } from 'wasp/server'
import type { PrismaClient } from 'wasp/server'
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth'
import type { AuthUser } from 'wasp/auth'
import { UserRole, OrganizationStatus, PlanType, BeneficiaryStatus, MotifVisite, BeneficiaryType, Gender } from '@prisma/client'

export const seedIbtisamaSimple: DbSeedFn = async (prisma: PrismaClient) => {
  console.log('🏢 Début du seeding simplifié de l\'organisation Ibtisama...')

  // 1. Vérifier si l'organisation existe déjà
  let ibtisamaOrg = await prisma.organization.findUnique({
    where: { slug: 'ibtisama' }
  })

  if (!ibtisamaOrg) {
    // Créer l'organisation Ibtisama
    ibtisamaOrg = await prisma.organization.create({
      data: {
        name: 'Ibtisama',
        slug: 'ibtisama',
        description: 'Organisation Ibtisama pour l\'accompagnement des femmes et enfants en difficulté',
        adminEmail: 'admin@ibtisama.ma',
        status: OrganizationStatus.ACTIVE,
        plan: PlanType.ENTERPRISE,
        maxUsers: 100,
        maxBeneficiaries: 500,
        maxStorage: 1000000000, // 1GB (limite INT4)
      }
    })
    console.log('✅ Organisation Ibtisama créée:', ibtisamaOrg.name)
  } else {
    console.log('✅ Organisation Ibtisama existe déjà')
  }

  // 2. Créer les utilisateurs principaux
  const usersToCreate = [
    {
      email: 'admin@ibtisama.ma',
      password: 'admin123',
      firstName: 'Amina',
      lastName: 'Bennani',
      firstNameAr: 'أمينة',
      lastNameAr: 'بناني',
      phone: '+212661234567',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1985, 3, 15),
      role: UserRole.ADMIN,
      isAdmin: true
    },
    {
      email: 'directeur@ibtisama.ma',
      password: 'directeur123',
      firstName: 'Youssef',
      lastName: 'Alaoui',
      firstNameAr: 'يوسف',
      lastNameAr: 'العلوي',
      phone: '+212662345678',
      gender: Gender.HOMME,
      dateOfBirth: new Date(1980, 8, 22),
      role: UserRole.DIRECTEUR,
      isAdmin: false
    },
    {
      email: 'coordinateur@ibtisama.ma',
      password: 'coord123',
      firstName: 'Rachid',
      lastName: 'Tazi',
      firstNameAr: 'رشيد',
      lastNameAr: 'التازي',
      phone: '+212663456789',
      gender: Gender.HOMME,
      dateOfBirth: new Date(1978, 11, 8),
      role: UserRole.COORDINATEUR,
      isAdmin: false
    },
    {
      email: 'accueil1@ibtisama.ma',
      password: 'accueil123',
      firstName: 'Fatima Zahra',
      lastName: 'Amrani',
      firstNameAr: 'فاطمة الزهراء',
      lastNameAr: 'العمراني',
      phone: '+212664567890',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1990, 5, 12),
      role: UserRole.AGENT_ACCUEIL,
      isAdmin: false
    },
    {
      email: 'assistante1@ibtisama.ma',
      password: 'assistante123',
      firstName: 'Khadija',
      lastName: 'Senhaji',
      firstNameAr: 'خديجة',
      lastNameAr: 'السنهاجي',
      phone: '+212665678901',
      gender: Gender.FEMME,
      dateOfBirth: new Date(1987, 2, 28),
      role: UserRole.ASSISTANTE_SOCIALE,
      isAdmin: false
    }
  ]

  for (const userData of usersToCreate) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existingUser) {
      await createUserWithAuth(prisma, {
        ...userData,
        organizationId: ibtisamaOrg.id
      })
      console.log(`👤 Utilisateur créé: ${userData.email} (${userData.role})`)
    } else {
      console.log(`👤 Utilisateur ${userData.email} existe déjà`)
    }
  }

  // 3. Créer les utilisateurs créés (pour les bénéficiaires)
  const createdUsers = await prisma.user.findMany({
    where: { organizationId: ibtisamaOrg.id }
  })

  // 4. Créer 15 bénéficiaires de test (10 femmes + 5 enfants)
  await createBeneficiaries(prisma, ibtisamaOrg.id, createdUsers)

  console.log('🎉 Seeding simplifié de l\'organisation Ibtisama terminé!')
  console.log('📧 Connexion:')
  console.log('   Admin: admin@ibtisama.ma / admin123')
  console.log('   Directeur: directeur@ibtisama.ma / directeur123')
  console.log('   Coordinateur: coordinateur@ibtisama.ma / coord123')
  console.log('   Accueil: accueil1@ibtisama.ma / accueil123')
  console.log('   Assistante: assistante1@ibtisama.ma / assistante123')
  console.log('🤝 15 bénéficiaires de test créés (10 femmes + 5 enfants)')
}

// Fonction utilitaire pour créer un utilisateur avec authentification
async function createUserWithAuth(
  prisma: PrismaClient,
  data: {
    email: string
    password: string
    firstName: string
    lastName: string
    firstNameAr?: string
    lastNameAr?: string
    phone?: string
    gender?: Gender
    dateOfBirth?: Date
    role: UserRole
    isAdmin: boolean
    organizationId: string
  }
): Promise<AuthUser> {
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      username: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      firstNameAr: data.firstNameAr,
      lastNameAr: data.lastNameAr,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      role: data.role,
      isAdmin: data.isAdmin,
      organizationId: data.organizationId,
      auth: {
        create: {
          identities: {
            create: {
              providerName: 'email',
              providerUserId: data.email,
              providerData: await sanitizeAndSerializeProviderData<'email'>({
                hashedPassword: data.password,
                isEmailVerified: true,
                emailVerificationSentAt: null,
                passwordResetSentAt: null
              }),
            },
          },
        },
      },
    },
  })

  return newUser as AuthUser
}

// Fonction pour créer 15 bénéficiaires de test (10 femmes + 5 enfants)
async function createBeneficiaries(prisma: PrismaClient, organizationId: string, users: any[]) {
  // Trouver les utilisateurs nécessaires
  const accueil1 = users.find(u => u.email === 'accueil1@ibtisama.ma')
  const coordinateur = users.find(u => u.email === 'coordinateur@ibtisama.ma')
  const assistante1 = users.find(u => u.email === 'assistante1@ibtisama.ma')

  const beneficiariesData = [
    {
      firstName: 'Aicha',
      lastName: 'Moussaoui',
      firstNameAr: 'عائشة',
      lastNameAr: 'الموساوي',
      age: 38,
      phone: '+212666789012',
      address: 'Hay Nahda, Rabat',
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.VIOLENCE_CONJUGALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Fatima Zahra',
      lastName: 'El Mansouri',
      firstNameAr: 'فاطمة الزهراء',
      lastNameAr: 'المنصوري',
      age: 33,
      phone: '+212667890123',
      address: 'Agdal, Rabat',
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.VIOLENCE_FAMILIALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Khadija',
      lastName: 'Bennani',
      firstNameAr: 'خديجة',
      lastNameAr: 'بناني',
      age: 35,
      phone: '+212668901234',
      address: 'Hassan, Rabat',
      status: BeneficiaryStatus.ORIENTE,
      visitReason: MotifVisite.AGRESSION_SEXUELLE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      orientedBy: coordinateur
    },
    {
      firstName: 'Zineb',
      lastName: 'Alaoui',
      firstNameAr: 'زينب',
      lastNameAr: 'العلوي',
      age: 31,
      phone: '+212669012345',
      address: 'Souissi, Rabat',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.HARCELEMENT,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      orientedBy: coordinateur,
      assignedTo: assistante1
    },
    {
      firstName: 'Salma',
      lastName: 'Idrissi',
      firstNameAr: 'سلمى',
      lastNameAr: 'الإدريسي',
      age: 15,
      phone: '+212670123456',
      address: 'Yacoub El Mansour, Rabat',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.PROTECTION_ENFANT,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1,
      orientedBy: coordinateur,
      assignedTo: assistante1
    },
    {
      firstName: 'Amina',
      lastName: 'Diallo',
      firstNameAr: 'أمينة',
      lastNameAr: 'ديالو',
      age: 36,
      phone: '+212671234567',
      address: 'Takaddoum, Rabat',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.AIDE_FINANCIERE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      assignedTo: assistante1
    },
    {
      firstName: 'Najat',
      lastName: 'Berrada',
      firstNameAr: 'نجاة',
      lastNameAr: 'برادة',
      age: 40,
      phone: '+212672345678',
      address: 'Hay Riad, Rabat',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.VIOLENCE_CONJUGALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      assignedTo: assistante1
    },
    {
      firstName: 'Malika',
      lastName: 'Fassi',
      firstNameAr: 'مليكة',
      lastNameAr: 'الفاسي',
      age: 29,
      phone: '+212673456789',
      address: 'Orangerie, Rabat',
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.SOUTIEN_PSYCHOLOGIQUE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Yousra',
      lastName: 'Tazi',
      firstNameAr: 'يسرى',
      lastNameAr: 'التازي',
      age: 26,
      phone: '+212674567890',
      address: 'Aviation, Rabat',
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.AIDE_JURIDIQUE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Hafsa',
      lastName: 'Chraibi',
      firstNameAr: 'حفصة',
      lastNameAr: 'الشرايبي',
      age: 32,
      phone: '+212675678901',
      address: 'Hay El Fath, Rabat',
      status: BeneficiaryStatus.ORIENTE,
      visitReason: MotifVisite.HEBERGEMENT_URGENCE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      orientedBy: coordinateur
    },
    // Ajout d'enfants bénéficiaires
    {
      firstName: 'Ahmed',
      lastName: 'Benali',
      firstNameAr: 'أحمد',
      lastNameAr: 'بن علي',
      age: 12,
      phone: '+212676789012',
      address: 'Douar Hajja, Salé',
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.PROTECTION_ENFANT,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1
    },
    {
      firstName: 'Yasmine',
      lastName: 'Ouali',
      firstNameAr: 'ياسمين',
      lastNameAr: 'الوالي',
      age: 8,
      phone: '+212677890123',
      address: 'Bettana, Salé',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.PROTECTION_ENFANT,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1,
      orientedBy: coordinateur,
      assignedTo: assistante1
    },
    {
      firstName: 'Omar',
      lastName: 'Kettani',
      firstNameAr: 'عمر',
      lastNameAr: 'الكتاني',
      age: 14,
      phone: '+212678901234',
      address: 'Laayayda, Salé',
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.SOINS_MEDICAUX,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1
    },
    {
      firstName: 'Lina',
      lastName: 'Fassi',
      firstNameAr: 'لينا',
      lastNameAr: 'الفاسي',
      age: 10,
      phone: '+212679012345',
      address: 'Chmaou, Salé',
      status: BeneficiaryStatus.ORIENTE,
      visitReason: MotifVisite.ACCOMPAGNEMENT_SOCIAL,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1,
      orientedBy: coordinateur
    },
    {
      firstName: 'Karim',
      lastName: 'Alami',
      firstNameAr: 'كريم',
      lastNameAr: 'العلمي',
      age: 16,
      phone: '+212680123456',
      address: 'Hay Karima, Salé',
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.FORMATION,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1,
      orientedBy: coordinateur,
      assignedTo: assistante1
    }
  ]

  for (const benefData of beneficiariesData) {
    // Vérifier si le bénéficiaire existe déjà
    const existingBenef = await prisma.beneficiary.findFirst({
      where: {
        firstName: benefData.firstName,
        lastName: benefData.lastName,
        organizationId
      }
    })

    if (!existingBenef) {
      await prisma.beneficiary.create({
        data: {
          firstName: benefData.firstName,
          lastName: benefData.lastName,
          gender: benefData.beneficiaryType === BeneficiaryType.FEMME ? Gender.FEMME : 
                  (benefData.firstName === 'Ahmed' || benefData.firstName === 'Omar' || benefData.firstName === 'Karim') ? Gender.HOMME : Gender.FEMME,
          dateOfBirth: new Date(new Date().getFullYear() - benefData.age, 0, 1),
          phone: (benefData as any).phone,
          address: (benefData as any).address,
          status: benefData.status,
          visitReason: benefData.visitReason,
          beneficiaryType: benefData.beneficiaryType,
          organizationId,
          createdById: benefData.createdBy?.id,
          orientedById: benefData.orientedBy?.id,
          assignedToId: benefData.assignedTo?.id,
          // Ajouter d'autres champs si nécessaire
          nomComplet: `${benefData.firstName} ${benefData.lastName}`,
          age: benefData.age,
          nationalite: 'Marocaine',
          notes: `Bénéficiaire ${benefData.beneficiaryType === BeneficiaryType.ENFANT ? 'enfant' : 'femme'} prise en charge pour ${benefData.visitReason}`,
        }
      })
      console.log(`🤝 Bénéficiaire créé: ${benefData.firstName} ${benefData.lastName} (${benefData.status})`)
    } else {
      console.log(`🤝 Bénéficiaire ${benefData.firstName} ${benefData.lastName} existe déjà`)
    }
  }
}
