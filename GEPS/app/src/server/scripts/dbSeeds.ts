import { type User } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';

type MockUserData = Omit<User, 'id'>;

/**
 * This function, which we've imported in `app.db.seeds` in the `main.wasp` file,
 * seeds the database with mock users via the `wasp db seed` command.
 * For more info see: https://wasp.sh/docs/data-model/backends#seeding-the-database
 */
export async function seedMockUsers(prismaClient: PrismaClient) {
  // Create admin user
  const adminUser = await prismaClient.user.create({
    data: {
      email: 'admin@geps.ma',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'GEPS',
      phone: '+212 5XX XXX XXX',
      role: 'ADMIN',
      isAdmin: true,
      isActive: true,
      status: 'APPROVED', // Admin est automatiquement approuvé
    }
  });

  // Create mock users
  await Promise.all(generateMockUsersData(20).map((data) => prismaClient.user.create({ data })));

  // Create mock beneficiaries
  const beneficiaries = await Promise.all(
    generateMockBeneficiariesData(30).map((data) => prismaClient.beneficiary.create({ data }))
  );

  // Create mock resources
  await Promise.all(generateMockResourcesData().map((data) => prismaClient.resource.create({ data })));

  // Create mock activities
  const activities = await Promise.all(
    generateMockActivitiesData(10).map((data) => prismaClient.activity.create({ data }))
  );

  // Create mock budgets
  const budgets = await Promise.all(
    generateMockBudgetsData().map((data) => prismaClient.budget.create({ data }))
  );

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created: ${beneficiaries.length} beneficiaries, ${activities.length} activities, ${budgets.length} budgets`);
}

function generateMockUsersData(numOfUsers: number): MockUserData[] {
  return faker.helpers.multiple(generateMockUserData, { count: numOfUsers });
}

function generateMockUserData(): MockUserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const now = new Date();
  const createdAt = faker.date.past({ refDate: now });
  
  const roles = [
    'ASSISTANTE_SOCIALE', 
    'TRAVAILLEUR_SOCIAL', 
    'RESPONSABLE_EDUCATION', 
    'GESTIONNAIRE_RESSOURCES', 
    'COMPTABLE',
    'AGENT_ACCUEIL',
    'COORDINATEUR',
    'CONSEILLER_JURIDIQUE',
    'RESPONSABLE_HEBERGEMENT',
    'RESPONSABLE_ACTIVITES',
    'DOCUMENTALISTE',
    'OBSERVATEUR'
  ] as const;
  
  return {
    email: faker.internet.email({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    firstName,
    lastName,
    firstNameAr: null, // Pour l'instant on laisse null, peut être ajouté plus tard
    lastNameAr: null,
    customRoleId: null, // Ajout du champ manquant
    gender: faker.helpers.arrayElement(['HOMME', 'FEMME', 'AUTRE']),
    avatar: null, // Pas d'avatar par défaut pour les données de test
    dateOfBirth: faker.date.between({ from: '1970-01-01', to: '2000-12-31' }),
    phone: faker.phone.number('+212 6## ### ###'),
    role: faker.helpers.arrayElement(roles),
    isAdmin: false,
    isActive: true,
    createdAt,
    updatedAt: now,
    // Nouveaux champs pour le système d'approbation
    status: 'APPROVED', // Pour les données de test, on approuve automatiquement
    approvedById: null,
    approvedAt: createdAt,
    rejectionReason: null,
  };
}

function generateMockBeneficiariesData(count: number) {
  return faker.helpers.multiple(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.helpers.arrayElement(['Male', 'Female']),
    dateOfBirth: faker.date.between({ from: '1980-01-01', to: '2010-12-31' }),
    phone: faker.phone.number('+212 6## ### ###'),
    address: faker.location.streetAddress(),
    familySituation: faker.helpers.arrayElement(['Single', 'Married', 'Divorced', 'Widowed']),
    professionalSituation: faker.helpers.arrayElement(['Unemployed', 'Student', 'Worker', 'Retired']),
    isActive: true,
  }), { count });
}

function generateMockResourcesData() {
  const resources = [
    { name: 'Rice', type: 'FOOD' as const, quantity: 100, unit: 'kg', module: 'Kitchen', alertThreshold: 20 },
    { name: 'Blankets', type: 'OTHER' as const, quantity: 50, unit: 'units', module: 'Dormitory', alertThreshold: 10 },
    { name: 'First Aid Kit', type: 'MEDICAL' as const, quantity: 15, unit: 'units', module: 'Medical', alertThreshold: 5 },
    { name: 'Books', type: 'OTHER' as const, quantity: 200, unit: 'units', module: 'Library', alertThreshold: 50 },
    { name: 'Cooking Oil', type: 'FOOD' as const, quantity: 30, unit: 'liters', module: 'Kitchen', alertThreshold: 5 },
    { name: 'Towels', type: 'OTHER' as const, quantity: 80, unit: 'units', module: 'Dormitory', alertThreshold: 15 },
  ];

  return resources.map(resource => ({
    ...resource,
    isActive: true,
  }));
}

function generateMockActivitiesData(count: number) {
  return faker.helpers.multiple(() => ({
    title: faker.helpers.arrayElement([
      'Art Workshop', 'Sports Day', 'Cooking Class', 'Computer Training',
      'Language Course', 'Music Session', 'Gardening Activity', 'Reading Club'
    ]),
    category: faker.helpers.arrayElement(['SPORTS', 'CULTURAL', 'EDUCATIONAL'] as const),
    description: faker.lorem.sentence(),
    location: faker.helpers.arrayElement(['Main Hall', 'Garden', 'Computer Room', 'Kitchen', 'Library']),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    capacity: faker.number.int({ min: 10, max: 50 }),
    status: faker.helpers.arrayElement(['PLANNED', 'IN_PROGRESS', 'COMPLETED'] as const),
    userId: '1', // Will be replaced with actual user ID
  }), { count });
}

function generateMockBudgetsData() {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      module: 'Kitchen',
      year: currentYear,
      initialAmount: 50000,
      usedAmount: 25000,
      description: 'Food and kitchen supplies budget',
      userId: '1', // Will be replaced with actual user ID
    },
    {
      module: 'Medical',
      year: currentYear,
      initialAmount: 30000,
      usedAmount: 12000,
      description: 'Medical supplies and healthcare budget',
      userId: '1',
    },
    {
      module: 'Education',
      year: currentYear,
      initialAmount: 40000,
      usedAmount: 18000,
      description: 'Educational materials and programs budget',
      userId: '1',
    },
    {
      module: 'Maintenance',
      year: currentYear,
      initialAmount: 25000,
      usedAmount: 8000,
      description: 'Building and equipment maintenance budget',
      userId: '1',
    },
  ];
}
