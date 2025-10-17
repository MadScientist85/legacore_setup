import { test, expect, Page } from '@playwright/test'

// Mock login helper (adjust based on actual auth implementation)
async function login(page: Page) {
  // TODO: Replace with actual login flow
  // This is a placeholder - update based on your authentication mechanism
  await page.goto('/login')
  await page.fill('input[name="email"]', 'admin@legacore.com')
  await page.fill('input[name="password"]', 'testpassword123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

test.describe('Health Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
  })

  test('should load health dashboard page', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Wait for the page to load
    await page.waitForSelector('h1')
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Health Dashboard')
  })

  test('should display overall system status', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for overall status card
    await expect(page.locator('text=Overall System Status')).toBeVisible()
    
    // Status should be one of: HEALTHY, DEGRADED, or UNHEALTHY
    const statusBadge = page.locator('text=/HEALTHY|DEGRADED|UNHEALTHY/').first()
    await expect(statusBadge).toBeVisible()
  })

  test('should display database connectivity section', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for database connectivity card
    await expect(page.locator('text=Database Connectivity')).toBeVisible()
  })

  test('should display database health checks', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for individual database services
    await expect(page.locator('text=Supabase')).toBeVisible()
    await expect(page.locator('text=MongoDB')).toBeVisible()
    await expect(page.locator('text=Redis')).toBeVisible()
  })

  test('should show database latency', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for latency information
    await expect(page.locator('text=/Latency: \\d+ms/')).toBeVisible()
  })

  test('should display application health section', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for application health card
    await expect(page.locator('text=Application Health')).toBeVisible()
  })

  test('should display application services', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for application services
    await expect(page.locator('text=API Endpoints')).toBeVisible()
    await expect(page.locator('text=Background Jobs')).toBeVisible()
    await expect(page.locator('text=Message Queue')).toBeVisible()
  })

  test('should display storage status section', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for storage status card
    await expect(page.locator('text=Storage Status')).toBeVisible()
    await expect(page.locator('text=Vercel Blob')).toBeVisible()
  })

  test('should display storage usage metrics', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for storage usage information
    await expect(page.locator('text=Storage Usage')).toBeVisible()
    await expect(page.locator('text=/\\d+\\.\\d+%/')).toBeVisible() // Percentage
  })

  test('should display version information section', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for version info card
    await expect(page.locator('text=Version Information')).toBeVisible()
  })

  test('should display commit SHA', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for commit SHA or placeholder
    const commitElement = page.locator('text=Commit SHA')
    await expect(commitElement).toBeVisible()
  })

  test('should display branch information', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for branch info
    const branchElement = page.locator('text=Branch')
    await expect(branchElement).toBeVisible()
  })

  test('should have refresh button', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for refresh button
    const refreshButton = page.locator('button:has-text("Refresh")')
    await expect(refreshButton).toBeVisible()
  })

  test('should display last checked timestamp', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for timestamp
    await expect(page.locator('text=/Last checked:/')).toBeVisible()
  })

  test('should display health status badges', async ({ page }) => {
    await page.goto('/dashboard/health')
    
    // Check for status badges (healthy, degraded, unhealthy)
    const statusBadges = page.locator('text=/healthy|degraded|unhealthy/i')
    await expect(statusBadges.first()).toBeVisible()
  })
})

test.describe('Health Dashboard - Database Health', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/health')
  })

  test('should display all database services', async ({ page }) => {
    const databases = ['Supabase', 'MongoDB', 'Redis']
    
    for (const db of databases) {
      await expect(page.locator(`text=${db}`)).toBeVisible()
    }
  })

  test('should show connection status for each database', async ({ page }) => {
    // Each database should have a status badge
    const statusBadges = page.locator('[class*="border"]').filter({ hasText: /healthy|degraded|unhealthy/i })
    const count = await statusBadges.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Health Dashboard - Application Health', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/health')
  })

  test('should display application services', async ({ page }) => {
    const services = ['API Endpoints', 'Background Jobs', 'Message Queue']
    
    for (const service of services) {
      await expect(page.locator(`text=${service}`)).toBeVisible()
    }
  })

  test('should show service metrics', async ({ page }) => {
    // Check for response time or other metrics
    const metricsText = page.locator('text=/Response time:|Latency:/')
    await expect(metricsText.first()).toBeVisible()
  })
})

test.describe('Health Dashboard - Storage', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/health')
  })

  test('should display storage provider', async ({ page }) => {
    await expect(page.locator('text=Vercel Blob')).toBeVisible()
  })

  test('should show storage usage details', async ({ page }) => {
    // Check for usage metrics
    await expect(page.locator('text=used')).toBeVisible()
    await expect(page.locator('text=total')).toBeVisible()
  })

  test('should show available storage', async ({ page }) => {
    await expect(page.locator('text=Available Storage')).toBeVisible()
  })
})
