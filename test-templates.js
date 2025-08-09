import { allTemplates, getTemplateById, getTemplatesByCategory, searchTemplates } from './src/data/index.js';

console.log('=== Template Data Structure Test ===\n');

console.log(`Total templates loaded: ${allTemplates.length}\n`);

console.log('Template summary:');
allTemplates.forEach(template => {
  console.log(`- ${template.name} (${template.category}): ${template.description}`);
});

console.log('\nTesting getTemplateById:');
const birthdayTemplate = getTemplateById('birthday-balloons-01');
console.log(`Found template: ${birthdayTemplate?.name || 'Not found'}`);

console.log('\nTesting getTemplatesByCategory:');
const birthdayTemplates = getTemplatesByCategory('birthday');
console.log(`Birthday templates: ${birthdayTemplates.length}`);

console.log('\nTesting searchTemplates:');
const sunshineResults = searchTemplates('sunshine');
console.log(`Search for 'sunshine': ${sunshineResults.length} results`);

console.log('\nTemplate structure validation:');
const testTemplate = allTemplates[0];
console.log(`- ID: ${testTemplate.id}`);
console.log(`- Category: ${testTemplate.category}`);
console.log(`- Created: ${testTemplate.createdAt instanceof Date ? 'Date object' : 'String'}`);
console.log(`- Panels: ${Object.keys(testTemplate.panels).join(', ')}`);
console.log(`- Front panel slots: ${testTemplate.panels.front.textSlots.length} text, ${testTemplate.panels.front.imageSlots.length} image`);

console.log('\n=== Test Complete ===');
