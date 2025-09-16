// Script de migration pour ajouter le type de bénéficiaire aux enregistrements existants
// Ce script peut être exécuté pour mettre à jour les bénéficiaires existants

import { BeneficiaryType } from '@prisma/client';

export async function migrateBeneficiaryTypes(context: any) {
  try {
    console.log('🔄 Début de la migration des types de bénéficiaires...');

    // Récupérer tous les bénéficiaires sans type défini
    const beneficiariesWithoutType = await context.entities.Beneficiary.findMany({
      where: {
        beneficiaryType: null
      }
    });

    console.log(`📊 ${beneficiariesWithoutType.length} bénéficiaires à traiter`);

    let updated = 0;
    let errors = 0;

    for (const beneficiary of beneficiariesWithoutType) {
      try {
        // Calculer l'âge
        const birthDate = new Date(beneficiary.dateOfBirth);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
          age--;
        }

        // Déterminer le type
        const beneficiaryType: BeneficiaryType = age < 18 ? BeneficiaryType.ENFANT : BeneficiaryType.FEMME;

        // Mettre à jour le bénéficiaire
        await context.entities.Beneficiary.update({
          where: { id: beneficiary.id },
          data: { beneficiaryType }
        });

        updated++;
        console.log(`✅ ${beneficiary.firstName} ${beneficiary.lastName} (${age} ans) → ${beneficiaryType}`);
      } catch (error) {
        console.error(`❌ Erreur pour ${beneficiary.firstName} ${beneficiary.lastName}:`, error);
        errors++;
      }
    }

    console.log(`\n🎉 Migration terminée !`);
    console.log(`✅ ${updated} bénéficiaires mis à jour`);
    if (errors > 0) {
      console.log(`❌ ${errors} erreurs`);
    }

    return { updated, errors };
  } catch (error) {
    console.error('💥 Erreur lors de la migration:', error);
    throw error;
  }
}

// Fonction utilitaire pour exécuter la migration manuellement
export async function runMigration() {
  // Cette fonction sera appelée manuellement si nécessaire
  console.log('Migration prête à être exécutée avec le contexte approprié');
}
