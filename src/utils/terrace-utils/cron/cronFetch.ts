import cron from 'node-cron';
import { createCustomValidatedTerrace } from '../../../controllers/terrace-controllers/terrace.validator.js';

export function cronFetch(schedule: string) {

    const task = cron.schedule(schedule, async () => {
        console.log('🏁 Starting quarterly terrace data update...');

        try {
            await createCustomValidatedTerrace();
            console.log('✅ DDBB update completed successfully');

        } catch (error) {
            console.error('❌ DDBB update failed:', error);
        }
    }, undefined);
    
    console.log('⏰ Scheduled DDBB terrace updates (every 3 months)');
    return task;
}