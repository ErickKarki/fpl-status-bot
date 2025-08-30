import dotenv from 'dotenv';
import cron from 'node-cron';
import express from 'express';
import { TwitterApi } from 'twitter-api-v2';
import { FPLService } from './services/fplService.js';
import { TwitterService } from './services/twitterService.js';
import { MessageFormatter } from './utils/messageFormatter.js';
import { ImageGenerator } from './services/imageGenerator.js';

dotenv.config();

const app = express();
const fplService = new FPLService();
const twitterService = new TwitterService();
const messageFormatter = new MessageFormatter();
const imageGenerator = new ImageGenerator();

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'Bot running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Health server running on port ${PORT}`);
});

async function checkAndPostUpdates() {
  try {
    console.log(`[${new Date().toISOString()}] Checking for FPL updates...`);
    
    const updates = await fplService.getLatestUpdates();
    
    if (updates.length === 0) {
      console.log('No new updates found.');
      return;
    }

    for (const update of updates) {
      const message = messageFormatter.formatUpdate(update);
      let imageUrl = null;

      // Generate image for each update type
      try {
        switch (update.type) {
          case 'gameweek_fixtures':
            const bootstrap = await fplService.getBootstrapData();
            imageUrl = await imageGenerator.generateFixtureCard(
              update.data.fixtures, 
              update.data.gameweek,
              bootstrap
            );
            break;
          case 'price_changes':
            imageUrl = await imageGenerator.generatePriceChangeCard(
              update.data.rises, 
              update.data.falls
            );
            break;
          case 'deadline_reminder':
            imageUrl = await imageGenerator.generateDeadlineCard(
              update.data.gameweek, 
              update.data.hoursLeft
            );
            break;
        }
      } catch (imageError) {
        console.error('Image generation failed, posting text only:', imageError);
      }
      
      if (process.env.DRY_RUN === 'true') {
        console.log('DRY RUN - Would post:', message);
        if (imageUrl) console.log('With image:', imageUrl);
      } else {
        await twitterService.postTweet(message, imageUrl);
        console.log('Posted update:', update.type);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
  } catch (error) {
    console.error('Error in checkAndPostUpdates:', error);
  }
}

function startBot() {
  console.log('🚀 FPL Status Bot starting...');
  
  const interval = process.env.POST_INTERVAL_MINUTES || 60;
  console.log(`📅 Scheduled to check every ${interval} minutes`);
  
  // Check for fixtures and deadlines every 30 minutes
  cron.schedule(`*/${interval} * * * *`, checkAndPostUpdates);
  
  // Check for daily price changes at 2:30 AM UTC (when FPL updates prices)
  cron.schedule('30 2 * * *', async () => {
    console.log('Checking for daily price changes...');
    await checkAndPostUpdates();
  });
  
  checkAndPostUpdates();
}

startBot();