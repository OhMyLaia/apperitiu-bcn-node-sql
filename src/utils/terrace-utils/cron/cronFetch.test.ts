// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
// import cron from 'node-cron'
// import { cronFetch } from './cronFetch.js'
// import { createCustomValidatedTerrace } from '../../../controllers/terrace-controllers/terrace.validator.js'

// // Mock dependencies
// vi.mock('node-cron')
// vi.mock('../../../controllers/terrace-controllers/terrace.validator.js', () => ({
//     createCustomValidatedTerrace: vi.fn()
// }))

// describe('cronFetch Function', () => {
//     const mockSchedule = '30 2 1 */3 *'
//     let mockTask: cron.ScheduledTask

//     beforeEach(() => {
//         vi.clearAllMocks()
//         mockTask = { start: vi.fn(), stop: vi.fn() } as unknown as cron.ScheduledTask
//         vi.mocked(cron.schedule).mockReturnValue(mockTask)
//     })

//     it('should schedule the job with provided schedule string', () => {
//         cronFetch(mockSchedule)

//         expect(cron.schedule).toHaveBeenCalledTimes(1)
//         expect(cron.schedule).toHaveBeenCalledWith(
//             mockSchedule,
//             expect.any(Function),
//             undefined
//         )
//     })

//     it('should execute createCustomValidatedTerrace when job runs', async () => {
//         const mockCronCallback = vi.fn()
//         vi.mocked(cron.schedule).mockImplementation((_, callback) => {
//             mockCronCallback.mockImplementation(callback as cron.TaskFn)
//             return mockTask
//         })

//         cronFetch(mockSchedule)
//         await mockCronCallback()

//         expect(createCustomValidatedTerrace).toHaveBeenCalledTimes(1)
//     })

//     it('should log success messages correctly', async () => {
//         const consoleLogSpy = vi.spyOn(console, 'log')
//         vi.mocked(createCustomValidatedTerrace).mockResolvedValue(undefined)

//         const mockCronCallback = vi.fn()
//         vi.mocked(cron.schedule).mockImplementation((_, callback) => {
//             mockCronCallback.mockImplementation(callback as cron.TaskFn)
//             return mockTask
//         })

//         cronFetch(mockSchedule)
//         await mockCronCallback()

//         expect(consoleLogSpy).toHaveBeenCalledWith('🏁 Starting quarterly terrace data update...')
//         expect(consoleLogSpy).toHaveBeenCalledWith('✅ DDBB update completed successfully')
//         expect(consoleLogSpy).toHaveBeenCalledWith('⏰ Scheduled DDBB terrace updates (every 3 months)')
//     })

//     it('should log error messages when function fails', async () => {
//         const consoleErrorSpy = vi.spyOn(console, 'error')
//         const testError = new Error('Test error')
//         vi.mocked(createCustomValidatedTerrace).mockRejectedValue(testError)

//         const mockCronCallback = vi.fn()
//         vi.mocked(cron.schedule).mockImplementation((_, callback) => {
//             mockCronCallback.mockImplementation(callback as cron.TaskFn)
//             return mockTask
//         })

//         cronFetch(mockSchedule)
//         await mockCronCallback()

//         expect(consoleErrorSpy).toHaveBeenCalledWith('❌ DDBB update failed:', testError)
//     })

//     it('should return the cron task instance', () => {
//         const result = cronFetch(mockSchedule)
//         expect(result).toBe(mockTask)
//     })
// })


import { describe, it, expect, vi, beforeEach } from 'vitest'
import cron from 'node-cron'
import { cronFetch } from './cronFetch.js' // Update path
import { createCustomValidatedTerrace } from '../../../controllers/terrace-controllers/terrace.validator.js'

vi.mock('node-cron', () => ({
    default: {
        schedule: vi.fn().mockImplementation(() => ({
            start: vi.fn()
        }))
    }
}))

vi.mock('../../../controllers/terrace-controllers/terrace.validator.js', () => ({
    createCustomValidatedTerrace: vi.fn()
}))

describe('cronFetch Function', () => {
    const mockSchedule = '30 2 1 */3 *'
    const mockTask = { start: vi.fn() } as unknown as cron.ScheduledTask

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(cron.schedule).mockReturnValue(mockTask)
    })

    it('should schedule the job with provided schedule string', () => {
        const result = cronFetch(mockSchedule)

        expect(cron.schedule).toHaveBeenCalledTimes(1)
        expect(cron.schedule).toHaveBeenCalledWith(
            mockSchedule,
            expect.any(Function),
            undefined
        )
        expect(result).toBe(mockTask)
    })

    it('should execute createCustomValidatedTerrace when job runs', async () => {
        let cronCallback: () => Promise<void>

        vi.mocked(cron.schedule).mockImplementation((_, callback) => {
            cronCallback = callback as () => Promise<void>
            return mockTask
        })

        cronFetch(mockSchedule)
        await cronCallback!() // Wait for the scheduled job to run

        expect(createCustomValidatedTerrace).toHaveBeenCalledTimes(1)
    })

    it('should log success messages', async () => {
        const consoleSpy = vi.spyOn(console, 'log')
        let cronCallback: () => Promise<void>

        vi.mocked(cron.schedule).mockImplementation((_, callback) => {
            cronCallback = callback as () => Promise<void>
            return mockTask
        })

        cronFetch(mockSchedule)
        await cronCallback!()

        expect(consoleSpy).toHaveBeenCalledWith('🏁 Starting quarterly terrace data update...')
        expect(consoleSpy).toHaveBeenCalledWith('✅ DDBB update completed successfully')
    })

    it('should log error messages when function fails', async () => {
        const consoleSpy = vi.spyOn(console, 'error')
        const testError = new Error('Test error')
        vi.mocked(createCustomValidatedTerrace).mockRejectedValue(testError)
        let cronCallback: () => Promise<void>

                vi.mocked(cron.schedule).mockImplementation((_, callback) => {
                    const mockTask: cron.ScheduledTask = {
                        start: vi.fn(),
                        stop: vi.fn(),
                        id: 'mock-id',
                        getStatus: vi.fn(),
                        destroy: vi.fn(),
                        execute: vi.fn(),
                        getNextRun: vi.fn(),
                        on: vi.fn(),
                        off: vi.fn(),
                        once: vi.fn(),
                    };
                    return mockTask;
                });
            });
        });
