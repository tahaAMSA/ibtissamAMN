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
      role: UserRole.ADMIN,
      isAdmin: true
    },
    {
      email: 'directeur@ibtisama.ma',
      password: 'directeur123',
      firstName: 'Youssef',
      lastName: 'Alaoui',
      role: UserRole.DIRECTEUR,
      isAdmin: false
    },
    {
      email: 'coordinateur@ibtisama.ma',
      password: 'coord123',
      firstName: 'Rachid',
      lastName: 'Tazi',
      role: UserRole.COORDINATEUR,
      isAdmin: false
    },
    {
      email: 'accueil1@ibtisama.ma',
      password: 'accueil123',
      firstName: 'Fatima Zahra',
      lastName: 'Amrani',
      role: UserRole.AGENT_ACCUEIL,
      isAdmin: false
    },
    {
      email: 'assistante1@ibtisama.ma',
      password: 'assistante123',
      firstName: 'Khadija',
      lastName: 'Senhaji',
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
      age: 38,
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.VIOLENCE_CONJUGALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Fatima Zahra',
      lastName: 'El Mansouri',
      age: 33,
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.VIOLENCE_FAMILIALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Khadija',
      lastName: 'Bennani',
      age: 35,
      status: BeneficiaryStatus.ORIENTE,
      visitReason: MotifVisite.AGRESSION_SEXUELLE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      orientedBy: coordinateur
    },
    {
      firstName: 'Zineb',
      lastName: 'Alaoui',
      age: 31,
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
      age: 15,
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
      age: 36,
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.AIDE_FINANCIERE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      assignedTo: assistante1
    },
    {
      firstName: 'Najat',
      lastName: 'Berrada',
      age: 40,
      status: BeneficiaryStatus.EN_SUIVI,
      visitReason: MotifVisite.VIOLENCE_CONJUGALE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1,
      assignedTo: assistante1
    },
    {
      firstName: 'Malika',
      lastName: 'Fassi',
      age: 29,
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.SOUTIEN_PSYCHOLOGIQUE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Yousra',
      lastName: 'Tazi',
      age: 26,
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.AIDE_JURIDIQUE,
      beneficiaryType: BeneficiaryType.FEMME,
      createdBy: accueil1
    },
    {
      firstName: 'Hafsa',
      lastName: 'Chraibi',
      age: 32,
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
      age: 12,
      status: BeneficiaryStatus.EN_ATTENTE_ACCUEIL,
      visitReason: MotifVisite.PROTECTION_ENFANT,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1
    },
    {
      firstName: 'Yasmine',
      lastName: 'Ouali',
      age: 8,
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
      age: 14,
      status: BeneficiaryStatus.EN_ATTENTE_ORIENTATION,
      visitReason: MotifVisite.SOINS_MEDICAUX,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1
    },
    {
      firstName: 'Lina',
      lastName: 'Fassi',
      age: 10,
      status: BeneficiaryStatus.ORIENTE,
      visitReason: MotifVisite.ACCOMPAGNEMENT_SOCIAL,
      beneficiaryType: BeneficiaryType.ENFANT,
      createdBy: accueil1,
      orientedBy: coordinateur
    },
    {
      firstName: 'Karim',
      lastName: 'Alami',
      age: 16,
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
          status: benefData.status,
          visitReason: benefData.visitReason,
          beneficiaryType: benefData.beneficiaryType,
          organizationId,
          createdById: benefData.createdBy?.id,
          orientedById: benefData.orientedBy?.id,
          assignedToId: benefData.assignedTo?.id,
        }
      })
      console.log(`🤝 Bénéficiaire créé: ${benefData.firstName} ${benefData.lastName} (${benefData.status})`)
    } else {
      console.log(`🤝 Bénéficiaire ${benefData.firstName} ${benefData.lastName} existe déjà`)
    }
  }
}
