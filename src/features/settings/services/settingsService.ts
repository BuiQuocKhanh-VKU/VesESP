import {
    mockSensorModules,
    mockGatewayInfo,
    mockThresholdConfig,
    mockUserRoles,
    mockNotificationConfig,
    mockSystemPreferences,
} from "@/services/mock/data/settings.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class SettingsService {
    async getDeviceConfig() {
        await delay();

        return {
            sensors: mockSensorModules,
            gateway: mockGatewayInfo,
        };
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

export const settingsService = new SettingsService();
