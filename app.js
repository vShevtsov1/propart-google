const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());
app.use(cors());

async function appendDataToSheet(values) {
    try {
        const serviceAccountKeyFile = 'plucky-respect-413015-4fc2a00d1238.json'; // Provide the path to your service account JSON file

        const auth = new google.auth.GoogleAuth({
            keyFile: serviceAccountKeyFile,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const spreadsheetId = '1UVtX63gJZxaNF-DsrtdA2AI98bBTEXTxepbzfhLl5aY';
        const range = 'ProPart!A1';
        const valuesArray = Object.values(values);

        const request = {
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                "majorDimension": "ROWS",
                values: [valuesArray]
            }
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log('Data appended successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error);
        throw error;
    }
}

app.post('/append-data', async (req, res) => {
    try {

        await appendDataToSheet(req.body);

        res.status(200).json({ message: 'Data appended to Google Sheet successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error appending data to Google Sheet' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
