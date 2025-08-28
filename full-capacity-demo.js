import { ImageGenerator } from './src/services/imageGenerator.js';

const imageGenerator = new ImageGenerator();

console.log('🎨 Generating FULL CAPACITY demo images...\n');

// Demo 1: 8 Fixtures (full capacity)
console.log('1. Generating fixture card with 8 matches...');
const fullFixtureData = [
  { team_h_short: 'ARS', team_a_short: 'MCI', kickoff_time: '2025-08-28T12:30:00Z' },
  { team_h_short: 'LIV', team_a_short: 'CHE', kickoff_time: '2025-08-28T15:00:00Z' },
  { team_h_short: 'MUN', team_a_short: 'TOT', kickoff_time: '2025-08-28T17:30:00Z' },
  { team_h_short: 'NEW', team_a_short: 'BHA', kickoff_time: '2025-08-28T14:00:00Z' },
  { team_h_short: 'AVL', team_a_short: 'EVE', kickoff_time: '2025-08-28T16:30:00Z' },
  { team_h_short: 'WHU', team_a_short: 'BUR', kickoff_time: '2025-08-28T19:00:00Z' },
  { team_h_short: 'CRY', team_a_short: 'FUL', kickoff_time: '2025-08-28T14:00:00Z' },
  { team_h_short: 'WOL', team_a_short: 'SHU', kickoff_time: '2025-08-28T16:30:00Z' }
];

try {
  const fixtureImage = await imageGenerator.generateFixtureCard(fullFixtureData, { id: 5 });
  console.log('✅ Full fixture card URL:', fixtureImage);
} catch (error) {
  console.log('❌ Fixture image failed:', error.message);
}

console.log('\n2. Generating price change card with 16 players...');
const manyRises = [
  { name: 'Salah', newPrice: '12.9' },
  { name: 'Haaland', newPrice: '15.1' },
  { name: 'Palmer', newPrice: '10.8' },
  { name: 'Son', newPrice: '9.5' },
  { name: 'Saka', newPrice: '8.7' },
  { name: 'Foden', newPrice: '9.2' },
  { name: 'Alexander-Arnold', newPrice: '7.1' },
  { name: 'Diaz', newPrice: '7.8' }
];

const manyFalls = [
  { name: 'Kane', newPrice: '11.1' },
  { name: 'Rashford', newPrice: '8.4' },
  { name: 'Sterling', newPrice: '7.2' },
  { name: 'Grealish', newPrice: '6.8' },
  { name: 'Mount', newPrice: '6.5' },
  { name: 'Maddison', newPrice: '7.9' },
  { name: 'Chilwell', newPrice: '5.8' },
  { name: 'Mahrez', newPrice: '8.1' }
];

try {
  const priceImage = await imageGenerator.generatePriceChangeCard(manyRises, manyFalls);
  console.log('✅ Full price change card URL:', priceImage);
} catch (error) {
  console.log('❌ Price image failed:', error.message);
}

console.log('\n3. Testing overflow (10 fixtures + 20 price changes)...');
const overflowFixtures = [...fullFixtureData, 
  { team_h_short: 'LEI', team_a_short: 'NOT', kickoff_time: '2025-08-28T20:00:00Z' },
  { team_h_short: 'BRE', team_a_short: 'LUT', kickoff_time: '2025-08-28T21:00:00Z' }
];

const extraRises = [...manyRises, 
  { name: 'Watkins', newPrice: '8.5' },
  { name: 'Isak', newPrice: '8.9' }
];

const extraFalls = [...manyFalls,
  { name: 'Jesus', newPrice: '8.0' },
  { name: 'Havertz', newPrice: '8.1' }
];

try {
  const overflowFixtureImage = await imageGenerator.generateFixtureCard(overflowFixtures, { id: 5 });
  console.log('✅ Overflow fixture card (10 matches):', overflowFixtureImage);
  
  const overflowPriceImage = await imageGenerator.generatePriceChangeCard(extraRises, extraFalls);
  console.log('✅ Overflow price card (20 players):', overflowPriceImage);
} catch (error) {
  console.log('❌ Overflow test failed:', error.message);
}

console.log('\n🎯 Cards automatically handle overflow with "+X more" indicators!');