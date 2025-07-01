import cron from 'cron';
import { createAutomatedBlogPost } from './blog-automation';

export class BlogScheduler {
  private weeklyBlogJob: cron.CronJob | null = null;

  start() {
    // Schedule weekly blog posts every Wednesday at 9:00 AM
    // This gives good timing for Houston framing customers browsing midweek
    this.weeklyBlogJob = new cron.CronJob(
      '0 9 * * 3', // Every Wednesday at 9:00 AM
      async () => {
        console.log('Starting automated weekly blog post generation...');
        try {
          const success = await createAutomatedBlogPost();
          if (success) {
            console.log('✅ Weekly blog post created successfully');
          } else {
            console.log('ℹ️ Weekly blog post already exists for this period');
          }
        } catch (error) {
          console.error('❌ Error creating weekly blog post:', error);
        }
      },
      null, // onComplete
      true, // start immediately
      'America/Chicago' // Houston timezone
    );

    console.log('📅 Blog scheduler started - weekly posts on Wednesdays at 9:00 AM CST');
  }

  stop() {
    if (this.weeklyBlogJob) {
      this.weeklyBlogJob.stop();
      this.weeklyBlogJob = null;
      console.log('📅 Blog scheduler stopped');
    }
  }

  // Manual trigger for testing
  async triggerManualPost(): Promise<boolean> {
    console.log('🔄 Manually triggering blog post generation...');
    try {
      const success = await createAutomatedBlogPost();
      if (success) {
        console.log('✅ Manual blog post created successfully');
      } else {
        console.log('ℹ️ Blog post already exists for this period');
      }
      return success;
    } catch (error) {
      console.error('❌ Error creating manual blog post:', error);
      return false;
    }
  }

  getStatus() {
    return {
      isRunning: this.weeklyBlogJob !== null,
      nextRun: this.weeklyBlogJob?.nextDates()?.toString() || null,
      schedule: 'Every Wednesday at 9:00 AM CST'
    };
  }
}

export const blogScheduler = new BlogScheduler();