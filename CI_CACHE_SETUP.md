# CI Dependency Caching Setup

This document explains how to configure CI dependency caching for the LEGACORE platform.

## Package Lock File

The `package-lock.json` file is included in the repository to enable consistent dependency resolution and faster CI builds.

## GitHub Actions Cache

If using GitHub Actions, add this to your workflow:

\`\`\`yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ${{ github.workspace }}/.next/cache
      ${{ github.workspace }}/node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
\`\`\`

## Vercel Deployment

Vercel automatically caches dependencies based on `package-lock.json`. No additional configuration needed.

### Build Cache Configuration

The following directories are automatically cached by Vercel:
- `node_modules`
- `.next/cache`
- `~/.npm`

## CircleCI Cache

\`\`\`yaml
- save_cache:
    key: dependency-cache-{{ checksum "package-lock.json" }}
    paths:
      - ./node_modules
      - ~/.npm
      - ./.next/cache
\`\`\`

## GitLab CI Cache

\`\`\`yaml
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/
    - .next/cache/
\`\`\`

## Travis CI Cache

\`\`\`yaml
cache:
  npm: true
  directories:
    - node_modules
    - .next/cache
\`\`\`

## Azure Pipelines Cache

\`\`\`yaml
- task: Cache@2
  displayName: 'Cache npm packages'
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: '$(System.DefaultWorkingDirectory)/node_modules'
    cacheHitVar: 'CACHE_RESTORED'
\`\`\`

## Benefits

1. **Faster Builds**: Dependencies are cached between builds
2. **Consistency**: Same versions installed across all environments
3. **Reliability**: Reduces network failures during dependency installation
4. **Cost Savings**: Reduced CI/CD execution time

## Updating Dependencies

\`\`\`bash
# Update all dependencies
npm update

# Update specific package
npm update package-name

# Install new package
npm install package-name

# The package-lock.json will be automatically updated
\`\`\`

## Troubleshooting

### Cache Not Working

\`\`\`bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
\`\`\`

### Version Conflicts

\`\`\`bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or update .npmrc
echo "legacy-peer-deps=true" >> .npmrc
\`\`\`

### Stale Cache

Most CI systems provide a way to clear the cache. For example:

**GitHub Actions**: Delete the cache from the Actions tab
**Vercel**: Redeploy with "Clear Cache and Deploy"
**CircleCI**: Use the "Clear Cache" button in project settings

## Best Practices

1. **Always commit package-lock.json** to version control
2. **Run `npm ci`** in CI instead of `npm install` for faster, more reliable installs
3. **Update dependencies regularly** to get security patches
4. **Monitor cache hit rates** in your CI dashboard
5. **Use exact versions** for critical dependencies

## Verification

To verify your cache is working:

\`\`\`bash
# First build (cache miss)
npm ci
# Time: ~2-3 minutes

# Second build (cache hit)
npm ci
# Time: ~10-30 seconds
\`\`\`

## Additional Resources

- [npm cache documentation](https://docs.npmjs.com/cli/v8/commands/npm-cache)
- [GitHub Actions cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Vercel build cache](https://vercel.com/docs/concepts/deployments/build-cache)
