// Script temporaire pour corriger rapidement les erreurs multi-tenant
// Ce script sera supprimé après usage

const fs = require('fs');
const path = require('path');

const files = [
  'src/budget/operations.ts',
  'src/documents/operations.ts', 
  'src/education/operations.ts',
  'src/interventions/operations.ts',
  'src/meals/operations.ts',
  'src/notifications/operations.ts',
  'src/projects/operations.ts',
  'src/resources/operations.ts',
  'src/time-tracking/operations.ts',
  'src/training/operations.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Ajouter les imports multi-tenant s'ils ne sont pas présents
    if (!content.includes('multiTenant')) {
      const importMatch = content.match(/import.*from '@prisma\/client';/);
      if (importMatch) {
        const imports = `import { 
  withOrganizationAccess,
  createWithOrganization
} from '../server/multiTenant';`;
        content = content.replace(importMatch[0], importMatch[0] + '\n' + imports);
      }
    }
    
    console.log(`Traitement de ${file}`);
    fs.writeFileSync(filePath, content);
  }
});

console.log('Script terminé. Vérifiez les fichiers modifiés.');
