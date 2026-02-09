const { MonitorType } = require("./monitor-type");
const { UP } = require("../../src/util");
const dayjs = require("dayjs");
const axios = require("axios");

class DiscordStatusMonitorType extends MonitorType {

    name = "discord-status";

    /**
     * @inheritdoc
     */
    async check(_monitor, heartbeat) {
        const startTime = dayjs().valueOf();

        // Fetch incidents + maintenance in parallel
        const [incidentsRes, maintenanceRes] = await Promise.all([
            axios.get("https://discordstatus.com/api/v2/incidents.json", {
                timeout: 10000,
            }),
            axios.get("https://discordstatus.com/api/v2/scheduled-maintenances.json", {
                timeout: 10000,
            }),
        ]);

        heartbeat.ping = dayjs().valueOf() - startTime;

        const incidents = incidentsRes.data.incidents ?? [];
        const maintenances = maintenanceRes.data.scheduled_maintenances ?? [];

        // Active incidents = anything not resolved
        const activeIncidents = incidents.filter(i => i.status !== "resolved");

        // Active maintenance = anything not completed
        const activeMaintenance = maintenances.filter(
            m => m.status !== "completed"
        );

        // Build readable message
        const messages = [];

        if (activeIncidents.length > 0) {
            messages.push(
                ...activeIncidents.map(
                    i => `Incident: ${i.name} (${i.impact})`
                )
            );
        }

        if (activeMaintenance.length > 0) {
            messages.push(
                ...activeMaintenance.map(
                    m => `Maintenance: ${m.name} (${m.status})`
                )
            );
        }

        // If anything active → DOWN
        if (messages.length > 0) {
            throw new Error(messages.join(" | "));
        }

        heartbeat.msg = "Discord operational – no active incidents or maintenance";
        heartbeat.status = UP;
    }
}

module.exports = {
    DiscordStatusMonitorType,
};