# FPL Status Bot

Automated Twitter bot for Fantasy Premier League status updates, similar to @FPLStatus.

## Features

- 🏆 Daily fixture announcements
- ⚡ Live fixture start notifications  
- ⏰ Deadline reminders
- 🔄 Automated posting schedule

## Setup

1. **Get Twitter API Access**
   - Apply at [developer.twitter.com](https://developer.twitter.com)
   - Create new app with write permissions
   - Get API keys and access tokens

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Twitter API credentials
   ```

4. **Run the Bot**
   ```bash
   # Development mode (with dry run)
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

- `TWITTER_API_KEY` - Your Twitter API key
- `TWITTER_API_SECRET` - Your Twitter API secret
- `TWITTER_ACCESS_TOKEN` - Your access token
- `TWITTER_ACCESS_SECRET` - Your access token secret
- `DRY_RUN` - Set to `true` to test without posting

## API Sources

- **FPL API**: `https://fantasy.premierleague.com/api/`
  - Bootstrap data for gameweek info
  - Fixtures for match schedules
  - No authentication required

## Deployment

Deploy to platforms like Heroku, Railway, or DigitalOcean with cron job scheduling.