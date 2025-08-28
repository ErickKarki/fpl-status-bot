export class MessageFormatter {
  
  formatUpdate(update) {
    switch (update.type) {
      case 'gameweek_fixtures':
        return this.formatGameweekFixtures(update.data);
      case 'upcoming_fixtures':
        return this.formatUpcomingFixtures(update.data);
      case 'deadline_reminder':
        return this.formatDeadlineReminder(update.data);
      case 'price_changes':
        return this.formatPriceChanges(update.data);
      default:
        return 'FPL Status Update';
    }
  }

  formatGameweekFixtures(data) {
    const { gameweek, fixtures } = data;
    let message = `🏆 GW${gameweek.id} Today\n`;
    
    fixtures.forEach(fixture => {
      const kickoffTime = new Date(fixture.kickoff_time);
      const timeStr = kickoffTime.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      message += `${timeStr} ${fixture.team_h_short || fixture.team_h}v${fixture.team_a_short || fixture.team_a}\n`;
    });

    message += `#FPL`;
    
    return message;
  }

  formatUpcomingFixtures(data) {
    const { fixtures } = data;
    let message = `⚡ STARTING SOON\n\n`;
    
    fixtures.forEach(fixture => {
      const kickoffTime = new Date(fixture.kickoff_time);
      const timeStr = kickoffTime.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      message += `${timeStr} ${fixture.team_h_short || fixture.team_h} vs ${fixture.team_a_short || fixture.team_a}\n`;
    });

    message += `\n#FPL #PremierLeague`;
    
    return message;
  }

  formatDeadlineReminder(data) {
    const { gameweek, hoursLeft } = data;
    
    let urgencyEmoji = '⏰';
    if (hoursLeft <= 2) urgencyEmoji = '🚨';
    else if (hoursLeft <= 6) urgencyEmoji = '⚠️';
    
    return `${urgencyEmoji} GW${gameweek.id} deadline ${hoursLeft}h\n#FPL`;
  }

  formatPriceChanges(data) {
    const { rises, falls } = data;
    
    if (rises.length === 0 && falls.length === 0) {
      return '💰 No changes\n#FPL';
    }

    let message = '💰 Price Changes\n';

    if (rises.length > 0) {
      message += '📈 ';
      rises.forEach((player, i) => {
        message += `${player.name} £${player.newPrice}m${i < rises.length - 1 ? ', ' : ''}`;
      });
      message += '\n';
    }

    if (falls.length > 0) {
      message += '📉 ';
      falls.forEach((player, i) => {
        message += `${player.name} £${player.newPrice}m${i < falls.length - 1 ? ', ' : ''}`;
      });
      message += '\n';
    }

    message += '#FPL';
    
    return message;
  }
}