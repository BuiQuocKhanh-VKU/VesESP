import {
    mockSensorModules,
    mockGatewayInfo,
    mockThresholdConfig,
    mockUserRoles,
    mockNotificationConfig,
    mockSystemPreferences,
} from "./data/settings.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export class SettingsService {
    async getDeviceConfig() {
        await delay();
        return { sensors: mockSensorModules, gateway: mockGatewayInfo };
    }
    async getThresholdConfig() {
        await delay();
        return mockThresholdConfig;
    }
    async getNotificationConfig() {
        await delay();
        return mockNotificationConfig;
    }
    async getUserRoles() {
        await delay();
        return mockUserRoles;
    }
    async getSystemPreferences() {
        await delay();
        return mockSystemPreferences;
    }
}
