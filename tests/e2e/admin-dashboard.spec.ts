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

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page)
  })

  test('should load admin dashboard page', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Wait for the page to load
    await page.waitForSelector('h1')
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Admin Dashboard')
  })

  test('should display overview tab by default', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Check if Overview tab is active
    const overviewTab = page.locator('button[value="overview"]')
    await expect(overviewTab).toHaveAttribute('data-state', 'active')
  })

  test('should display system metrics', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Check for system metrics card
    await expect(page.locator('text=System Metrics')).toBeVisible()
    await expect(page.locator('text=Uptime')).toBeVisible()
    await expect(page.locator('text=Environment')).toBeVisible()
  })

  test('should display RFP analytics', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Check for RFP analytics card
    await expect(page.locator('text=RFP Analytics')).toBeVisible()
    await expect(page.locator('text=Total RFPs')).toBeVisible()
    await expect(page.locator('text=Success Rate')).toBeVisible()
  })

  test('should switch to users tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Click on Users tab
    await page.click('button:has-text("Users")')
    
    // Check if Users tab content is visible
    await expect(page.locator('text=User Management')).toBeVisible()
  })

  test('should display user list', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Switch to users tab
    await page.click('button:has-text("Users")')
    
    // Check for user management section
    await expect(page.locator('text=Manage platform users')).toBeVisible()
    
    // Check if at least one user is displayed (mock data should have users)
    const userCards = page.locator('div:has-text("@")').first()
    await expect(userCards).toBeVisible()
  })

  test('should switch to database tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Click on Database tab
    await page.click('button:has-text("Database")')
    
    // Check if database status is visible
    await expect(page.locator('text=Database Status')).toBeVisible()
  })

  test('should display database connections', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Switch to database tab
    await page.click('button:has-text("Database")')
    
    // Check for database connections (mock data includes Supabase, MongoDB, Redis)
    await expect(page.locator('text=Supabase')).toBeVisible()
    await expect(page.locator('text=MongoDB')).toBeVisible()
    await expect(page.locator('text=Redis')).toBeVisible()
  })

  test('should switch to AI providers tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Click on AI Providers tab
    await page.click('button:has-text("AI Providers")')
    
    // Check if AI provider status is visible
    await expect(page.locator('text=AI Provider Status')).toBeVisible()
  })

  test('should display AI providers', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Switch to AI tab
    await page.click('button:has-text("AI Providers")')
    
    // Check for AI providers (mock data includes OpenAI, Anthropic, etc.)
    await expect(page.locator('text=OpenAI')).toBeVisible()
    await expect(page.locator('text=Anthropic')).toBeVisible()
  })

  test('should switch to system tab', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Click on System tab
    await page.click('button:has-text("System")')
    
    // Check if system metrics are visible
    await expect(page.locator('text=System Metrics')).toBeVisible()
  })

  test('should display all tabs', async ({ page }) => {
    await page.goto('/dashboard/admin')
    
    // Check all tabs are present
    await expect(page.locator('button:has-text("Overview")')).toBeVisible()
    await expect(page.locator('button:has-text("Users")')).toBeVisible()
    await expect(page.locator('button:has-text("Database")')).toBeVisible()
    await expect(page.locator('button:has-text("AI Providers")')).toBeVisible()
    await expect(page.locator('button:has-text("System")')).toBeVisible()
  })
})

test.describe('Admin Dashboard - User Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/dashboard/admin')
    await page.click('button:has-text("Users")')
  })

  test('should display user roles', async ({ page }) => {
    // Check for different user roles
    await expect(page.locator('text=admin')).toBeVisible()
    await expect(page.locator('text=user')).toBeVisible()
  })

  test('should display user status badges', async ({ page }) => {
    // Check for status badges (active, inactive, etc.)
    const statusBadges = page.locator('text=active')
    await expect(statusBadges.first()).toBeVisible()
  })

  test('should show edit and delete buttons for users', async ({ page }) => {
    // Check for edit/delete buttons (they should be present for each user)
    const editButtons = page.locator('button:has([class*="Edit"])')
    const deleteButtons = page.locator('button:has([class*="Trash"])')
    
    await expect(editButtons.first()).toBeVisible()
    await expect(deleteButtons.first()).toBeVisible()
  })
})
