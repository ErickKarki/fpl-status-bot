import { ImageGenerator } from './src/services/imageGenerator.js';

const imageGenerator = new ImageGenerator();

console.log('🎨 Generating demo images...\n');

// Demo 1: Fixtures
console.log('1. Generating fixture card...');
const fixtureData = [
  { team_h_short: 'ARS', team_a_short: 'MCI', kickoff_time: '2025-08-28T15:30:00Z' },
  { team_h_short: 'LIV', team_a_short: 'CHE', kickoff_time: '2025-08-28T18:00:00Z' },
  { team_h_short: 'MUN', team_a_short: 'TOT', kickoff_time: '2025-08-28T20:30:00Z' }
];

try {
  const fixtureImage = await imageGenerator.generateFixtureCard(fixtureData, { id: 5 });
  console.log('✅ Fixture image URL:', fixtureImage);
} catch (error) {
  console.log('❌ Fixture image failed:', error.message);
}

console.log('\n2. Generating price change card...');
const priceRises = [
  { name: 'Salah', newPrice: '12.9' },
  { name: 'Haaland', newPrice: '15.1' },
  { name: 'Palmer', newPrice: '10.8' }
];
const priceFalls = [
  { name: 'Kane', newPrice: '11.1' },
  { name: 'Rashford', newPrice: '8.4' }
];

try {
  const priceImage = await imageGenerator.generatePriceChangeCard(priceRises, priceFalls);
  console.log('✅ Price change image URL:', priceImage);
} catch (error) {
  console.log('❌ Price image failed:', error.message);
}

console.log('\n3. Generating deadline card...');
try {
  const deadlineImage = await imageGenerator.generateDeadlineCard({ id: 6 }, 2);
  console.log('✅ Deadline image URL:', deadlineImage);
} catch (error) {
  console.log('❌ Deadline image failed:', error.message);
}

console.log('\n🎯 All images would be automatically posted with tweets!');