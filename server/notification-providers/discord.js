const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP } = require("../../src/util");

class Discord extends NotificationProvider {
    name = "discord";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";
        const SUPPRESS_NOTIFICATIONS_FLAG = 1 << 12;

        try {
            let config = this.getAxiosConfigWithProxy({});
            const discordDisplayName = notification.discordUsername || "Uptime Kuma";
            const webhookUrl = new URL(notification.discordWebhookUrl);

            if (notification.discordChannelType === "postToThread") {
                webhookUrl.searchParams.append("thread_id", notification.threadId);
            }

            let webhookHasAvatar = true;
            try {
                const webhookInfo = await axios.get(webhookUrl.toString(), config);
                webhookHasAvatar = !!webhookInfo.data.avatar;
            } catch (e) {
                webhookHasAvatar = true;
            }

            const avatarUrl = "https://images.noxxbot.com/TwNooMmSMR-KGCj2LiO9-vfMQnPX7GI4Mq2";

            // Test Message Logic
            if (!heartbeatJSON) {
                const testData = {
                    username: discordDisplayName,
                    embeds: [{
                        title: "🔔 Connection Test",
                        description: "Your Discord notification provider is configured correctly.",
                        color: 3447003, // Discord Blue
                        fields: [{ name: "Message", value: msg }]
                    }]
                };
                if (!webhookHasAvatar) testData.avatar_url = avatarUrl;
                await axios.post(webhookUrl.toString(), testData, config);
                return okMsg;
            }

            const serviceAddress = this.extractAddress(monitorJSON);
            const monitorName = monitorJSON["name"];
            const isUp = heartbeatJSON["status"] === UP;
            
            // Layout fields
            const fields = [
                { name: "🏷️ Monitor", value: `**${monitorName}**`, inline: true },
                { name: "📡 Service Type", value: `\`${(monitorJSON["type"] || "N/A").toUpperCase()}\``, inline: true },
                { name: "🕒 Node Time", value: heartbeatJSON["localDateTime"] || "N/A", inline: true },
            ];

            // Address Section (Strictly no links)
            if (serviceAddress) {
                fields.push({ 
                    name: "📍 Target", 
                    value: `\`${serviceAddress.replace(/https?:\/\//, '')}\``, 
                    inline: false 
                });
            }

            let embedTitle = "";
            let embedColor = 0;
            let statusText = "";

            if (!isUp) {
                const wentOfflineTimestamp = Math.floor(new Date(heartbeatJSON["time"]).getTime() / 1000);
                embedTitle = `🛑 SERVICE DOWN: ${monitorName}`;
                embedColor = 15158332; // Soft Red
                statusText = "The service is currently unreachable.";

                fields.push(
                    { name: "📉 Down Since", value: `<t:${wentOfflineTimestamp}:F> (<t:${wentOfflineTimestamp}:R>)`, inline: false },
                    { name: "📝 Error Logs", value: `\`\`\`${heartbeatJSON["msg"] || "No error details available"}\`\`\``, inline: false }
                );
            } else {
                const backOnlineTimestamp = Math.floor(new Date(heartbeatJSON["time"]).getTime() / 1000);
                embedTitle = `💚 SERVICE UP: ${monitorName}`;
                embedColor = 3066993; // Soft Green
                statusText = "The service has returned to its normal state.";

                if (heartbeatJSON["lastDownTime"]) {
                    const wentOfflineTimestamp = Math.floor(new Date(heartbeatJSON["lastDownTime"]).getTime() / 1000);
                    const duration = this.formatDuration(backOnlineTimestamp - wentOfflineTimestamp);
                    fields.push({ name: "⏱️ Recovery Time", value: `\`${duration}\``, inline: true });
                }

                if (heartbeatJSON["ping"] != null) {
                    fields.push({ name: "⚡ Latency", value: `\`${heartbeatJSON["ping"]}ms\``, inline: true });
                }
            }

            // Custom Admin Note
            fields.push({
                name: "━━━━━━━━━━━━━━━━━━━━━━━━━━",
                value: "⚠️ **Notice:** If this change was unplanned, **ItzF34R.mp4!** will provide an update shortly.",
                inline: false
            });

            const payload = {
                username: discordDisplayName,
                embeds: [{
                    title: embedTitle,
                    color: embedColor,
                    description: `**Status Update:** ${statusText}`,
                    fields: fields,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Xyron Dev Systems • Automated Monitoring",
                        icon_url: avatarUrl
                    },
                    thumbnail: {
                        url: isUp 
                            ? "https://cdn-icons-png.flaticon.com/512/190/190411.png" // Green Check
                            : "https://cdn-icons-png.flaticon.com/512/595/595067.png"  // Red Warning
                    }
                }],
            };

            if (!webhookHasAvatar) payload.avatar_url = avatarUrl;
            if (notification.discordChannelType === "createNewForumPost") payload.thread_name = notification.postName;
            if (notification.discordPrefixMessage) payload.content = notification.discordPrefixMessage;
            if (notification.discordSuppressNotifications) payload.flags = SUPPRESS_NOTIFICATIONS_FLAG;

            await axios.post(webhookUrl.toString(), payload, config);
            return okMsg;

        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    formatDuration(timeInSeconds) {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        const durationParts = [];
        if (hours > 0) durationParts.push(`${hours}h`);
        if (minutes > 0) durationParts.push(`${minutes}m`);
        if (seconds > 0 || durationParts.length === 0) durationParts.push(`${seconds}s`);

        return durationParts.join(" ");
    }
}

module.exports = Discord;