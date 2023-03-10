// eslint-disable-next-line camelcase
import type { sheets_v4 } from 'googleapis';

import type { GoogleClientService } from './google-client.service';
import { googleClientService } from './google-client.service';

export class GoogleSheetService {
    // eslint-disable-next-line camelcase
    sheets: sheets_v4.Sheets;

    constructor(googleClient: GoogleClientService) {
        this.sheets = googleClient.sheets;
    }

    getSheet(spreadsheetId: string, sheetName: string, range: string) {
        return this.sheets.spreadsheets.values
            .get({
                spreadsheetId,
                range: `${sheetName}!${range}`,
            })
            .then((result) => (result.data.values || []).map((row) => row[0] as string));
    }

    appendToSheet(spreadsheetId: string, sheetName: string, range: string, value: string) {
        return this.sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[value]],
            },
        });
    }

    update(spreadsheetId: string, sheetName: string, range: string, value: string[]) {
        return this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: value.map((item) => [item]),
            },
        });
    }

    async appendToSheetSafe(spreadsheetId: string, sheetName: string, range: string, value: string) {
        const newValues = await this.getSheet(spreadsheetId, sheetName, range);

        newValues.push(value);

        return this.update(spreadsheetId, sheetName, range, newValues);
    }
}

export const googleSheetService = new GoogleSheetService(googleClientService);
