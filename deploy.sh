set -e
npm run parcel:clean && npm install && npm run parcel:prod && pm2 restart app
echo "\n\nDone  ※\(^o^)/※..."
