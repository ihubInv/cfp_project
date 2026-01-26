# Backend Status & Management

## ✅ Backend is Running

The backend is now running and managed by PM2 for stability and automatic restarts.

### Current Status

- **Status:** Online
- **Process Manager:** PM2
- **Process Name:** `cfp-backend`
- **Port:** 5000
- **MongoDB:** Connected ✅

### Quick Commands

#### Check Backend Status
```bash
pm2 status
pm2 info cfp-backend
```

#### View Logs
```bash
# Real-time logs
pm2 logs cfp-backend

# Last 50 lines
pm2 logs cfp-backend --lines 50

# Error logs only
pm2 logs cfp-backend --err --lines 50
```

#### Restart Backend
```bash
pm2 restart cfp-backend
```

#### Stop Backend
```bash
pm2 stop cfp-backend
```

#### Start Backend
```bash
pm2 start cfp-backend
# Or use the startup script:
/root/Fariyad/cfp_project/backend/start-backend.sh
```

### Test Backend

```bash
# Health check
curl http://cfpihubiitmandi.cloud/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

### Configuration

- **Backend Directory:** `/root/Fariyad/cfp_project/backend`
- **Environment File:** `/root/Fariyad/cfp_project/backend/.env`
- **Port:** 5000
- **Frontend URL:** Configured for `cfpihubiitmandi.cloud`

### Auto-Start on Reboot

PM2 is configured to automatically start the backend on server reboot. This was set up with:
```bash
pm2 startup
pm2 save
```

### Troubleshooting

If the backend is not responding:

1. **Check PM2 Status:**
   ```bash
   pm2 status
   ```

2. **Check Logs:**
   ```bash
   pm2 logs cfp-backend --lines 100
   ```

3. **Restart Backend:**
   ```bash
   pm2 restart cfp-backend
   ```

4. **Check Port:**
   ```bash
   netstat -tulpn | grep 5000
   ```

5. **Test Direct Connection:**
   ```bash
   curl http://localhost:5000/api/health
   ```

6. **Test Through Domain:**
   ```bash
   curl http://cfpihubiitmandi.cloud/api/health
   ```

### Environment Variables

The backend `.env` file includes:
- `PORT=5000`
- `NODE_ENV=development`
- `FRONTEND_URL=http://cfpihubiitmandi.cloud,https://cfpihubiitmandi.cloud,...`
- MongoDB connection string
- JWT secrets

### Notes

- Backend automatically restarts if it crashes (PM2 feature)
- Logs are stored in `/root/.pm2/logs/`
- Backend will start automatically on server reboot
