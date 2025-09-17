import { HttpError } from 'wasp/server'
import type { AuthUser } from 'wasp/auth'

/**
 * Utilitaires pour le système multi-tenant
 * Chaque organisation a ses propres données complètement isolées
 */

/**
 * Récupère l'organizationId de l'utilisateur connecté
 */
export async function getUserOrganizationId(
  user: AuthUser | null,
  context: { entities: any }
): Promise<string> {
  if (!user) {
    throw new HttpError(401, 'Non autorisé')
  }

  // Récupère l'utilisateur complet avec organizationId
  const fullUser = await context.entities.User.findUnique({
    where: { id: user.id },
    select: { organizationId: true }
  })

  if (!fullUser?.organizationId) {
    throw new HttpError(400, 'Utilisateur non associé à une organisation')
  }

  return fullUser.organizationId
}

/**
 * Ajoute automatiquement le filtre d'organisation à une query Prisma
 */
export function addOrganizationFilter(
  organizationId: string,
  whereClause: any = {}
): any {
  return {
    ...whereClause,
    organizationId
  }
}

/**
 * Vérifie que l'utilisateur peut accéder à une ressource de son organisation
 */
export async function verifyOrganizationAccess(
  resourceId: string,
  resourceType: keyof typeof ENTITY_MAP,
  userOrganizationId: string,
  context: { entities: any }
): Promise<void> {
  const entityName = ENTITY_MAP[resourceType]
  
  if (!entityName) {
    throw new HttpError(400, `Type de ressource invalide: ${resourceType}`)
  }

  const resource = await context.entities[entityName].findUnique({
    where: { id: resourceId },
    select: { organizationId: true }
  })

  if (!resource) {
    throw new HttpError(404, 'Ressource non trouvée')
  }

  if (resource.organizationId !== userOrganizationId) {
    throw new HttpError(403, 'Accès refusé - ressource d\'une autre organisation')
  }
}

/**
 * Vérifie qu'un ensemble de ressources appartiennent à l'organisation de l'utilisateur
 */
export async function verifyMultipleResourcesAccess(
  resourceIds: string[],
  resourceType: keyof typeof ENTITY_MAP,
  userOrganizationId: string,
  context: { entities: any }
): Promise<void> {
  const entityName = ENTITY_MAP[resourceType]
  
  const resources = await context.entities[entityName].findMany({
    where: { 
      id: { in: resourceIds }
    },
    select: { id: true, organizationId: true }
  })

  // Vérifier que toutes les ressources existent
  if (resources.length !== resourceIds.length) {
    throw new HttpError(404, 'Une ou plusieurs ressources non trouvées')
  }

  // Vérifier que toutes appartiennent à la bonne organisation
  const wrongOrgResources = resources.filter((r: any) => r.organizationId !== userOrganizationId)
  if (wrongOrgResources.length > 0) {
    throw new HttpError(403, 'Accès refusé - certaines ressources appartiennent à d\'autres organisations')
  }
}

/**
 * Middleware pour les opérations : vérifie automatiquement l'organisation
 */
export async function withOrganizationAccess<T>(
  user: AuthUser | null,
  context: { entities: any },
  operation: (organizationId: string) => Promise<T>
): Promise<T> {
  const organizationId = await getUserOrganizationId(user, context)
  return await operation(organizationId)
}

/**
 * Mapping des types de ressources vers les entités Prisma
 */
const ENTITY_MAP = {
  beneficiary: 'Beneficiary',
  document: 'Document',
  intervention: 'SocialIntervention',
  stay: 'Stay',
  meal: 'Meal',
  resource: 'Resource',
  education: 'Education',
  enrollment: 'Enrollment',
  activity: 'Activity',
  training: 'Training',
  project: 'EntrepreneurialProject',
  budget: 'Budget',
  timeSession: 'TimeSession',
  notification: 'Notification',
  role: 'Role'
} as const

/**
 * Vérifie les limites de l'organisation selon son plan
 */
export async function checkOrganizationLimits(
  organizationId: string,
  resourceType: 'users' | 'beneficiaries' | 'storage',
  context: { entities: any }
): Promise<void> {
  const organization = await context.entities.Organization.findUnique({
    where: { id: organizationId },
    select: { 
      maxUsers: true, 
      maxBeneficiaries: true, 
      maxStorage: true,
      status: true 
    }
  })

  if (!organization) {
    throw new HttpError(404, 'Organisation non trouvée')
  }

  if (organization.status !== 'ACTIVE') {
    throw new HttpError(403, 'Organisation suspendue ou inactive')
  }

  // Vérifications selon le type de ressource
  switch (resourceType) {
    case 'users':
      const userCount = await context.entities.User.count({
        where: { organizationId }
      })
      if (userCount >= organization.maxUsers) {
        throw new HttpError(403, `Limite d'utilisateurs atteinte (${organization.maxUsers})`)
      }
      break

    case 'beneficiaries':
      const beneficiaryCount = await context.entities.Beneficiary.count({
        where: { organizationId }
      })
      if (beneficiaryCount >= organization.maxBeneficiaries) {
        throw new HttpError(403, `Limite de bénéficiaires atteinte (${organization.maxBeneficiaries})`)
      }
      break

    case 'storage':
      // Pour l'instant, pas de vérification du stockage
      // TODO: Implémenter le calcul de l'espace utilisé
      break
  }
}

/**
 * Helper pour créer des ressources avec organizationId automatique
 */
export function createWithOrganization(
  organizationId: string,
  data: any
): any {
  return {
    ...data,
    organizationId
  }
}

/**
 * Type helper pour les opérations multi-tenant
 */
export type WithOrganization<T> = T & { organizationId: string }