import { unauthorizedAPI } from "./api";
import { generatePasswordUrl, sendToSlackUrl } from "./urls";

export interface GenerateOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeDigits: boolean;
    includeSymbols: boolean;
}

export const generatePassword = async (options: GenerateOptions): Promise<{ password: string }> => {
    const response = await unauthorizedAPI.post(generatePasswordUrl, options);
    return response.data;
};

export const sendPasswordToSlack = async (password: string): Promise<{ success: boolean }> => {
    const response = await unauthorizedAPI.post(sendToSlackUrl, { password });
    return response.data;
};
