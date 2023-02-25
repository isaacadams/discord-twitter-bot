chmod +x src/index.js
cp pain-bot.service /etc/systemd/system/pain-bot.service
systemctl daemon-reload
systemctl enable pain-bot
systemctl start pain-bot
# See logs with journalctl -u pain-bot