import axios from 'axios';

export class ImageGenerator {
  constructor() {
    // Using HTML/CSS to Image API for automated image generation
    this.baseURL = 'https://htmlcsstoimage.com/demo_run';
  }

  async generateFixtureCard(fixtures, gameweek) {
    const html = this.createFixtureHTML(fixtures, gameweek);
    const css = this.getFixtureCSS();
    
    try {
      const response = await axios.post(this.baseURL, {
        html: html,
        css: css,
        device_scale_factor: 2
      });
      
      return response.data.url; // Returns image URL
    } catch (error) {
      console.error('Error generating fixture image:', error);
      return null;
    }
  }

  async generatePriceChangeCard(rises, falls) {
    const html = this.createPriceChangeHTML(rises, falls);
    const css = this.getPriceChangeCSS();
    
    try {
      const response = await axios.post(this.baseURL, {
        html: html,
        css: css,
        device_scale_factor: 2
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error generating price change image:', error);
      return null;
    }
  }

  async generateDeadlineCard(gameweek, hoursLeft) {
    const html = this.createDeadlineHTML(gameweek, hoursLeft);
    const css = this.getDeadlineCSS();
    
    try {
      const response = await axios.post(this.baseURL, {
        html: html,
        css: css,
        device_scale_factor: 2
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error generating deadline image:', error);
      return null;
    }
  }

  createFixtureHTML(fixtures, gameweek) {
    let fixtureList = '';
    fixtures.forEach(fixture => {
      const time = new Date(fixture.kickoff_time).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
      });
      fixtureList += `
        <div class="fixture">
          <span class="time">${time}</span>
          <div class="teams">
            <span class="team home">${fixture.team_h_short || fixture.team_h}</span>
            <span class="vs">v</span>
            <span class="team away">${fixture.team_a_short || fixture.team_a}</span>
          </div>
        </div>
      `;
    });

    return `
      <div class="card fixture-card">
        <div class="header">
          <div class="logo">⚽</div>
          <h1>GAMEWEEK ${gameweek.id}</h1>
          <div class="subtitle">TODAY'S FIXTURES</div>
        </div>
        <div class="fixtures">
          ${fixtureList}
        </div>
        <div class="footer">
          <span class="hashtag">#FPL</span>
          <span class="brand">PREMIER LEAGUE</span>
        </div>
      </div>
    `;
  }

  createPriceChangeHTML(rises, falls) {
    let risesHTML = '';
    rises.forEach(player => {
      risesHTML += `<div class="player-row rise"><span class="name">${player.name}</span><span class="price">£${player.newPrice}m</span></div>`;
    });

    let fallsHTML = '';
    falls.forEach(player => {
      fallsHTML += `<div class="player-row fall"><span class="name">${player.name}</span><span class="price">£${player.newPrice}m</span></div>`;
    });

    return `
      <div class="card price-card">
        <div class="header">
          <div class="logo">⚽</div>
          <h1>PRICE CHANGES</h1>
          <div class="date">${new Date().toLocaleDateString('en-GB')}</div>
        </div>
        <div class="content">
          ${rises.length > 0 ? `
            <div class="section">
              <div class="section-title rises-title">📈 RISES</div>
              <div class="players-list">${risesHTML}</div>
            </div>
          ` : ''}
          ${falls.length > 0 ? `
            <div class="section">
              <div class="section-title falls-title">📉 FALLS</div>
              <div class="players-list">${fallsHTML}</div>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <span class="hashtag">#FPL</span>
          <span class="brand">FANTASY PREMIER LEAGUE</span>
        </div>
      </div>
    `;
  }

  createDeadlineHTML(gameweek, hoursLeft) {
    const urgency = hoursLeft <= 2 ? '🚨' : hoursLeft <= 6 ? '⚠️' : '⏰';
    
    return `
      <div class="card deadline">
        <div class="header">
          <h1>${urgency} Deadline Alert</h1>
        </div>
        <div class="content">
          <div class="time">GW${gameweek.id} - ${hoursLeft}h remaining</div>
        </div>
        <div class="footer">#FPL</div>
      </div>
    `;
  }

  getFixtureCSS() {
    return `
      .fixture-card {
        width: 500px;
        background: linear-gradient(135deg, #37003c 0%, #1a1a2e 100%);
        border-radius: 0;
        color: white;
        font-family: 'Helvetica', sans-serif;
        padding: 30px;
        box-shadow: none;
        position: relative;
        overflow: hidden;
      }
      .fixture-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #e90052, #37003c, #e90052);
      }
      .header {
        text-align: center;
        margin-bottom: 25px;
      }
      .logo {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 2px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      .subtitle {
        font-size: 14px;
        opacity: 0.9;
        font-weight: 600;
        margin-top: 5px;
      }
      .fixtures {
        margin: 25px 0;
      }
      .fixture {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 18px;
        margin: 12px 0;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
        backdrop-filter: blur(10px);
        border-left: 4px solid #00ff87;
        gap: 25px;
      }
      .time {
        font-weight: 800;
        font-size: 22px;
        color: #00ff87;
        text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        min-width: 60px;
        text-align: center;
      }
      .teams {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .team {
        font-size: 18px;
        font-weight: 700;
        padding: 8px 12px;
        border-radius: 3px;
        background: rgba(255,255,255,0.15);
        min-width: 55px;
        text-align: center;
      }
      .vs {
        font-size: 14px;
        opacity: 0.8;
        font-weight: 600;
      }
      .more {
        text-align: center;
        padding: 10px;
        font-size: 14px;
        opacity: 0.7;
        font-style: italic;
      }
      .footer {
        text-align: center;
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.2);
      }
      .hashtag {
        font-size: 20px;
        font-weight: bold;
        color: #e90052;
      }
      .brand {
        display: block;
        font-size: 10px;
        margin-top: 5px;
        opacity: 0.7;
        letter-spacing: 1px;
      }
    `;
  }

  getPriceChangeCSS() {
    return `
      .price-card {
        width: 500px;
        background: linear-gradient(135deg, #37003c 0%, #1a1a2e 100%);
        border-radius: 0;
        color: white;
        font-family: 'Helvetica', sans-serif;
        padding: 30px;
        box-shadow: none;
        position: relative;
        overflow: hidden;
      }
      .price-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #37003c, #00ff87, #37003c);
      }
      .more {
        text-align: center;
        padding: 15px;
        font-size: 14px;
        opacity: 0.7;
        font-style: italic;
        border-top: 1px solid rgba(255,255,255,0.1);
        margin-top: 15px;
      }
      .header {
        text-align: center;
        margin-bottom: 25px;
        position: relative;
      }
      .logo {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: 2px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      .date {
        font-size: 12px;
        opacity: 0.8;
        margin-top: 5px;
      }
      .section {
        margin: 20px 0;
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
        padding: 15px;
        backdrop-filter: blur(10px);
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
        padding: 8px;
        border-radius: 3px;
      }
      .rises-title {
        background: rgba(0, 255, 135, 0.2);
        border: 1px solid rgba(0, 255, 135, 0.3);
      }
      .falls-title {
        background: rgba(255, 0, 100, 0.2);
        border: 1px solid rgba(255, 0, 100, 0.3);
      }
      .players-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .player-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        border-radius: 3px;
        font-size: 16px;
        font-weight: 600;
      }
      .player-row.rise {
        background: rgba(0, 255, 135, 0.15);
        border-left: 4px solid #00ff87;
      }
      .player-row.fall {
        background: rgba(255, 0, 100, 0.15);
        border-left: 4px solid #ff0064;
      }
      .name {
        font-weight: 700;
      }
      .price {
        font-weight: 800;
        font-size: 18px;
      }
      .player-row.rise .price {
        color: #00ff87;
      }
      .player-row.fall .price {
        color: #ff4757;
      }
      .footer {
        text-align: center;
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.2);
      }
      .hashtag {
        font-size: 20px;
        font-weight: bold;
        color: #00ff87;
      }
      .brand {
        display: block;
        font-size: 10px;
        margin-top: 5px;
        opacity: 0.7;
        letter-spacing: 1px;
      }
    `;
  }

  getDeadlineCSS() {
    return `
      .card {
        width: 400px;
        background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        border-radius: 15px;
        color: white;
        font-family: 'Arial', sans-serif;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .time {
        font-size: 20px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        margin-top: 20px;
        font-weight: bold;
        opacity: 0.8;
      }
    `;
  }
}