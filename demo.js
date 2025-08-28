import { MessageFormatter } from './src/utils/messageFormatter.js';

const formatter = new MessageFormatter();

console.log('🎭 FPL Status Bot - Tweet Examples\n');

// Example 1: Today's fixtures
const fixturesUpdate = {
  type: 'gameweek_fixtures',
  data: {
    gameweek: { id: 5 },
    fixtures: [
      { 
        team_h_short: 'ARS', 
        team_a_short: 'MCI', 
        kickoff_time: '2025-08-28T16:30:00Z' 
      },
      { 
        team_h_short: 'LIV', 
        team_a_short: 'CHE', 
        kickoff_time: '2025-08-28T19:00:00Z' 
      }
    ]
  }
};

console.log('📅 FIXTURES TWEET:');
console.log('─'.repeat(50));
console.log(formatter.formatUpdate(fixturesUpdate));
console.log('\n');

// Example 2: Upcoming match
const upcomingUpdate = {
  type: 'upcoming_fixtures',
  data: {
    fixtures: [
      { 
        team_h_short: 'MUN', 
        team_a_short: 'TOT', 
        kickoff_time: '2025-08-28T17:30:00Z' 
      }
    ]
  }
};

console.log('⚡ STARTING SOON TWEET:');
console.log('─'.repeat(50));
console.log(formatter.formatUpdate(upcomingUpdate));
console.log('\n');

// Example 3: Deadline reminder
const deadlineUpdate = {
  type: 'deadline_reminder',
  data: {
    gameweek: { id: 6 },
    hoursLeft: 3
  }
};

console.log('🚨 DEADLINE ALERT TWEET:');
console.log('─'.repeat(50));
console.log(formatter.formatUpdate(deadlineUpdate));
console.log('\n');

// Example 4: Urgent deadline
const urgentDeadline = {
  type: 'deadline_reminder',
  data: {
    gameweek: { id: 6 },
    hoursLeft: 1
  }
};

console.log('🚨 URGENT DEADLINE TWEET:');
console.log('─'.repeat(50));
console.log(formatter.formatUpdate(urgentDeadline));
console.log('\n');

// Example 5: Price changes
const priceChanges = {
  type: 'price_changes',
  data: {
    rises: [
      { name: 'Salah', team: 'LIV', oldPrice: '12.8', newPrice: '12.9' },
      { name: 'Haaland', team: 'MCI', oldPrice: '15.0', newPrice: '15.1' },
      { name: 'Palmer', team: 'CHE', oldPrice: '10.7', newPrice: '10.8' }
    ],
    falls: [
      { name: 'Kane', team: 'TOT', oldPrice: '11.2', newPrice: '11.1' },
      { name: 'Rashford', team: 'MUN', oldPrice: '8.5', newPrice: '8.4' }
    ]
  }
};

console.log('💰 PRICE CHANGES TWEET:');
console.log('─'.repeat(50));
console.log(formatter.formatUpdate(priceChanges));