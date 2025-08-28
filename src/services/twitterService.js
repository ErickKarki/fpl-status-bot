import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    this.rwClient = this.client.readWrite;
  }

  async postTweet(content, imageUrl = null) {
    try {
      if (content.length > 280) {
        content = content.substring(0, 277) + '...';
      }

      let tweetData = { text: content };

      if (imageUrl) {
        // Download and upload image
        const imageBuffer = await this.downloadImage(imageUrl);
        const mediaId = await this.rwClient.v1.uploadMedia(imageBuffer, { mimeType: 'image/png' });
        tweetData.media = { media_ids: [mediaId] };
      }

      const tweet = await this.rwClient.v2.tweet(tweetData);
      console.log('Tweet posted successfully:', tweet.data.id);
      return tweet;
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  }

  async downloadImage(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async verifyCredentials() {
    try {
      const user = await this.rwClient.v2.me();
      console.log('Twitter API credentials verified for:', user.data.username);
      return user;
    } catch (error) {
      console.error('Error verifying Twitter credentials:', error);
      throw error;
    }
  }
}