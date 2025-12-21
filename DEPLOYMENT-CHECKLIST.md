# DESTINY WORLD - DEPLOYMENT CHECKLIST
## Phase 2 System Verification & Launch

**Date:** December 21, 2025  
**Status:** Ready for Production  
**Checklist Version:** 1.0  

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Environment Setup

- [ ] Node.js 14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git configured (`git config --list`)
- [ ] Sufficient disk space (500MB+)
- [ ] Network connectivity verified
- [ ] Cron job availability checked (for Linux/Mac)

### API Credentials

- [ ] GitHub Personal Access Token generated
  - [ ] Scopes: repo, admin:repo_hook, user:email
  - [ ] Token stored in `.env` as `GITHUB_TOKEN`
  
- [ ] Perplexity API Key obtained
  - [ ] Subscription active
  - [ ] Key stored in `.env` as `PERPLEXITY_API_KEY`
  
- [ ] Linear API Key generated
  - [ ] Team access verified
  - [ ] Key stored in `.env` as `LINEAR_API_KEY`
  
- [ ] Google Service Account created
  - [ ] OAuth2 credentials downloaded
  - [ ] Drive API enabled
  - [ ] Gmail API enabled
  - [ ] JSON stored in `.env` as `GOOGLE_CREDENTIALS`
  
- [ ] VIVERSE API Key obtained
  - [ ] Environment set to production
  - [ ] Key stored in `.env` as `VIVERSE_API_KEY`

### Repository Setup

- [ ] Repository cloned successfully
- [ ] All branches synced (`git branch -a`)
- [ ] Local main branch up to date
- [ ] `.gitignore` includes `.env`
- [ ] Node modules installed (`npm install`)
- [ ] No npm vulnerabilities (`npm audit`)

---

## 🧪 SYSTEM TESTING

### Unit Tests

#### Daily Build System
```bash
node -e "const DBS = require('./systems/daily-build-system.js'); console.log('✅ Daily Build System loads')"
```
- [ ] Loads without errors
- [ ] All phases defined
- [ ] Export types correct

#### Connectors Module
```bash
node -e "const Conn = require('./systems/connectors.js'); const c = new Conn(); console.log('✅ Connectors initialized')"
```
- [ ] Initializes without errors
- [ ] All connector methods present
- [ ] Configuration loaded correctly

#### AI Evolution System
```bash
node -e "const AIEvol = require('./ai/alien-killer-evolution.js'); const ai = new AIEvol(); console.log('✅ AI Evolution System ready')"
```
- [ ] Initializes without errors
- [ ] K'Thaal profile loaded
- [ ] Learning database populated

### Integration Tests

#### API Connectivity
- [ ] GitHub API responds (rate limit check)
- [ ] Perplexity API responds (token valid)
- [ ] Linear API responds (team access valid)
- [ ] Google Drive API responds (credentials valid)
- [ ] VIVERSE API responds (game ID valid)

#### Data Flow
- [ ] Can read from Google Drive
- [ ] Can write to GitHub
- [ ] Can parse Perplexity responses
- [ ] Can format VIVERSE payloads
- [ ] Can send Gmail reports

#### Content Generation
- [ ] Location generation works
- [ ] NPC generation works
- [ ] Encounter generation works
- [ ] Dialogue generation works
- [ ] All content validates as JSON

### Performance Tests

```bash
time node systems/daily-build-system.js
```

- [ ] Complete build < 60 minutes
- [ ] Memory usage < 2GB
- [ ] No memory leaks during execution
- [ ] Proper cleanup after completion

---

## 🔐 SECURITY CHECKLIST

### Credentials

- [ ] No credentials in code
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` safe (no real tokens)
- [ ] Credentials rotated in past 30 days
- [ ] API key scopes minimized
- [ ] No hardcoded URLs or endpoints

### API Security

- [ ] All requests use HTTPS
- [ ] No sensitive data in logs
- [ ] Error messages sanitized
- [ ] Rate limiting implemented
- [ ] Retry logic with exponential backoff
- [ ] Request timeouts configured (30s)

### Data Security

- [ ] Player data encrypted at rest
- [ ] Commits signed when deployed
- [ ] No personal info in build logs
- [ ] User permissions enforced
- [ ] Audit logging enabled
- [ ] Backup strategy documented

---

## 📊 MONITORING SETUP

### Logging

- [ ] Log directory created (`mkdir -p logs`)
- [ ] Log rotation configured (if applicable)
- [ ] Error logging captures stack traces
- [ ] Info logging tracks phases
- [ ] Debug logging available for troubleshooting

### Metrics Collection

- [ ] Build metrics saved to JSON
- [ ] Execution times tracked
- [ ] API call counts recorded
- [ ] Error rates calculated
- [ ] Content generation stats stored

### Alerting

- [ ] Email alerts configured for failures
- [ ] Slack webhook available (optional)
- [ ] Daily report emails scheduled
- [ ] Error threshold set (e.g., 3 failures)
- [ ] On-call schedule established

---

## 📦 DEPLOYMENT VERIFICATION

### First Run

```bash
# 1. Run manual build
node systems/daily-build-system.js

# Expected output:
# ✅ PHASE 1: Analyzing Player Metrics...
# ✅ PHASE 2A: Generating 3 new locations...
# ✅ PHASE 2B: Generating 5 new NPCs...
# ✅ PHASE 2C: Generating 4 new encounters...
# ✅ PHASE 3: Evolving Alien Killer AI...
# ✅ PHASE 4: Enhancing Dialogue Trees...
# ✅ PHASE 5: Updating Game State...
# ✅ PHASE 6: Committing to GitHub...
# ✅ PHASE 7: Deploying to VIVERSE...
# ✅ PHASE 8: Generating Build Report...
#
# BUILD CYCLE COMPLETE
# Version: v1.0.47
# Content Generated: 312 items
# Next Build: 2025-12-22T00:00:00Z
```

- [ ] All 8 phases complete
- [ ] No errors or warnings
- [ ] Build time recorded
- [ ] Content count > 200
- [ ] Next build scheduled

### GitHub Verification

```bash
# Check for new commits
git log --oneline | head -5

# Expected: Latest commits from daily-build system
```

- [ ] New commits appear in repository
- [ ] Commit messages are descriptive
- [ ] Files are correct (game-state, build-logs, docs)
- [ ] Branch protection rules pass
- [ ] No conflicts with main branch

### Content Validation

```bash
# Check generated content
cat game-state/daily-content-pack.json | jq '.locations | length'

# Expected: 3 or more
```

- [ ] `daily-content-pack.json` is valid JSON
- [ ] Locations array has 3+ items
- [ ] NPCs array has 5+ items
- [ ] Encounters array has 4+ items
- [ ] Dialogue count > 50
- [ ] All required fields present

### Build Log Verification

```bash
# Check build metrics
cat build-logs/daily-build-log.json | jq '.buildLog.tasks | length'

# Expected: 8 (one for each phase)
```

- [ ] Build log is valid JSON
- [ ] All 8 phases logged
- [ ] Timestamps are correct
- [ ] Task statuses are COMPLETE
- [ ] Errors array is empty
- [ ] Metrics are populated

---

## 🚀 SCHEDULER SETUP

### Linux/Mac (Cron)

```bash
# 1. Edit crontab
crontab -e

# 2. Add daily build job (runs at midnight UTC)
0 0 * * * cd /path/to/AI-Alien-Horror-Game && node systems/daily-build-system.js >> logs/daily-build.log 2>&1

# 3. Verify cron job
crontab -l | grep daily-build-system
```

- [ ] Cron entry added to crontab
- [ ] Path is absolute (not relative)
- [ ] Logging redirected to file
- [ ] Cron job verification shows entry

### Windows (Task Scheduler)

```powershell
# 1. Create scheduled task
$action = New-ScheduledTaskAction -Execute 'node' -Argument 'systems\daily-build-system.js' -WorkingDirectory 'C:\path\to\project'
$trigger = New-ScheduledTaskTrigger -Daily -At 00:00
Register-ScheduledTask -TaskName "Destiny-Daily-Build" -Action $action -Trigger $trigger

# 2. Verify task
Get-ScheduledTask -TaskName "Destiny-Daily-Build"
```

- [ ] Task created successfully
- [ ] Trigger set to 00:00
- [ ] Action points to correct script
- [ ] Working directory set
- [ ] Task status is "Ready"

### Docker (Optional)

```bash
# 1. Create Dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
RUN echo "0 0 * * * node systems/daily-build-system.js" > /etc/cron.d/daily-build
CMD ["cron", "-f"]

# 2. Build image
docker build -t destiny-world-builder:latest .

# 3. Run container
docker run -d --name destiny-builder -e GITHUB_TOKEN=xxx destiny-world-builder:latest
```

- [ ] Dockerfile created
- [ ] Container builds without errors
- [ ] Environment variables passed correctly
- [ ] Container runs continuously
- [ ] Logs accessible (`docker logs destiny-builder`)

---

## 📋 POST-DEPLOYMENT

### First 24 Hours

- [ ] First build completed successfully
- [ ] Content appears in VIVERSE
- [ ] GitHub commit successful
- [ ] Email report received
- [ ] No error logs
- [ ] Performance metrics acceptable

### First Week

- [ ] 7 consecutive successful builds
- [ ] All APIs responding reliably
- [ ] Player feedback collected
- [ ] Content quality maintained
- [ ] AI killer evolution observed
- [ ] Game feels "alive" to players

### First Month

- [ ] 30 consecutive successful builds
- [ ] 1,800+ content items generated
- [ ] K'Thaal evolution level 10+
- [ ] Player base growing
- [ ] Community forming
- [ ] No critical issues

---

## 🔧 TROUBLESHOOTING

### Build Fails to Start

```bash
# Check Node.js installation
node --version

# Check npm installation
npm --version

# Check .env file exists
ls -la | grep env

# Check file permissions
chmod +x systems/daily-build-system.js
```

### API Errors

```bash
# Test GitHub connectivity
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Test Perplexity connectivity
curl -H "Authorization: Bearer $PERPLEXITY_API_KEY" https://api.perplexity.ai/health

# Check rate limits
node -e "const Conn = require('./systems/connectors.js'); const c = new Conn(); c.orchestrateFullDataSync().then(d => console.log(JSON.stringify(d.summary, null, 2)))"
```

### Content Generation Issues

```bash
# Validate generated JSON
node -e "const data = require('./game-state/daily-content-pack.json'); console.log('✅ Valid JSON'); console.log('Items:', Object.values(data).flat().length)"

# Check Perplexity responses
grep -i "error\|failed" logs/daily-build.log
```

### Deployment Failures

```bash
# Check VIVERSE connectivity
node -e "const Conn = require('./systems/connectors.js'); const c = new Conn(); c.viverse_fetchWorldState().then(s => console.log(s))"

# Check GitHub commit status
git log --oneline | head -3
```

---

## ✅ SIGN-OFF

### Launch Approval

- [ ] All checklist items completed
- [ ] First manual build successful
- [ ] Scheduler configured and tested
- [ ] Monitoring and alerts active
- [ ] Documentation reviewed
- [ ] Team trained on monitoring
- [ ] Ready for production launch

### Handoff

- [ ] Documentation shared with team
- [ ] Contact info for on-call engineer
- [ ] Escalation path defined
- [ ] Rollback procedure documented
- [ ] Backup systems ready
- [ ] Team has access to all systems

---

## 📞 LAUNCH CONTACTS

**Project Lead:** [Your Name]  
**Tech Lead:** [Your Name]  
**DevOps Lead:** [Your Name]  
**On-Call Engineer:** [Your Name]  
**Emergency Contact:** [Your Phone]

---

**System Status:** 🟢 READY FOR PRODUCTION  
**Launch Date:** December 21, 2025  
**First Build:** December 21, 2025 13:30 UTC  
**Scheduled Builds:** Daily at 00:00 UTC  

✅ **ALL SYSTEMS GO**
