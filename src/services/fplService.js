import axios from 'axios';

export class FPLService {
  constructor() {
    this.baseURL = 'https://fantasy.premierleague.com/api';
    this.lastChecked = new Date();
    this.cache = new Map();
    this.postedDeadlines = new Set(); // Track posted deadlines
  }

  async getBootstrapData() {
    try {
      const response = await axios.get(`${this.baseURL}/bootstrap-static/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bootstrap data:', error);
      throw error;
    }
  }

  async getFixtures() {
    try {
      const response = await axios.get(`${this.baseURL}/fixtures/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      throw error;
    }
  }

  async getCurrentGameweek() {
    const bootstrap = await this.getBootstrapData();
    const currentEvent = bootstrap.events.find(event => event.is_current);
    const nextEvent = bootstrap.events.find(event => event.is_next);
    
    // Return current or next event with proper data
    return currentEvent || nextEvent || bootstrap.events[0];
  }

  async getLatestUpdates() {
    const updates = [];
    
    try {
      const currentGameweek = await this.getCurrentGameweek();
      const fixtures = await this.getFixtures();
      
      const bootstrap = await this.getBootstrapData();
      const todayFixtures = fixtures.filter(fixture => {
        const fixtureDate = new Date(fixture.kickoff_time);
        const today = new Date();
        return fixtureDate.toDateString() === today.toDateString();
      });

      if (todayFixtures.length > 0) {
        // Add team names to fixtures
        const fixturesWithTeams = todayFixtures.map(fixture => {
          const homeTeam = this.getTeamName(fixture.team_h, bootstrap);
          const awayTeam = this.getTeamName(fixture.team_a, bootstrap);
          console.log(`Mapping: ${fixture.team_h} -> ${homeTeam}, ${fixture.team_a} -> ${awayTeam}`);
          
          return {
            ...fixture,
            team_h_short: homeTeam,
            team_a_short: awayTeam
          };
        });

        updates.push({
          type: 'gameweek_fixtures',
          data: {
            gameweek: currentGameweek,
            fixtures: fixturesWithTeams
          }
        });
      }


      const deadline = new Date(currentGameweek?.deadline_time);
      const now = new Date();
      const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);

      if (hoursUntilDeadline > 0 && hoursUntilDeadline <= 3) {
        const deadlineKey = `gw${currentGameweek.id}`;
        
        // Only post deadline once per gameweek
        if (!this.postedDeadlines.has(deadlineKey)) {
          this.postedDeadlines.add(deadlineKey);
          updates.push({
            type: 'deadline_reminder',
            data: {
              gameweek: currentGameweek,
              hoursLeft: Math.round(hoursUntilDeadline)
            }
          });
        }
      }

      // Check for daily price changes
      const priceChanges = await this.getPriceChanges();
      if (priceChanges.rises.length > 0 || priceChanges.falls.length > 0) {
        updates.push({
          type: 'price_changes',
          data: priceChanges
        });
      }

    } catch (error) {
      console.error('Error getting latest updates:', error);
    }

    return updates;
  }

  async getPriceChanges() {
    try {
      const bootstrap = await this.getBootstrapData();
      const players = bootstrap.elements;
      
      // Get cached prices from yesterday
      const yesterdayKey = this.getYesterdayKey();
      const yesterdayPrices = this.cache.get(yesterdayKey) || {};
      
      // Store today's prices
      const todayKey = this.getTodayKey();
      const todayPrices = {};
      
      const rises = [];
      const falls = [];
      
      players.forEach(player => {
        const currentPrice = player.now_cost;
        const playerName = player.web_name;
        const teamName = this.getTeamName(player.team, bootstrap);
        
        todayPrices[player.id] = currentPrice;
        
        if (yesterdayPrices[player.id]) {
          const oldPrice = yesterdayPrices[player.id];
          
          if (currentPrice > oldPrice) {
            rises.push({
              name: playerName,
              team: teamName,
              oldPrice: (oldPrice / 10).toFixed(1),
              newPrice: (currentPrice / 10).toFixed(1)
            });
          } else if (currentPrice < oldPrice) {
            falls.push({
              name: playerName,
              team: teamName,
              oldPrice: (oldPrice / 10).toFixed(1),
              newPrice: (currentPrice / 10).toFixed(1)
            });
          }
        }
      });
      
      // Cache today's prices
      this.cache.set(todayKey, todayPrices);
      
      return { rises, falls };
      
    } catch (error) {
      console.error('Error getting price changes:', error);
      return { rises: [], falls: [] };
    }
  }

  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  getYesterdayKey() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  getTeamName(teamId, bootstrap) {
    const team = bootstrap.teams.find(t => t.id === teamId);
    return team ? team.short_name : 'Unknown';
  }
}