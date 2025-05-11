import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as ExcelJS from 'exceljs';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

@Injectable()
export class ReportService {
    // Función para generar el reporte en PDF con Puppeteer
    public async generatePDFReport(data: any[], tableName: string): Promise<Buffer> {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // Plantilla HTML usando Handlebars para mayor flexibilidad
            const template = handlebars.compile(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                        .title { text-align: center; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        .no-data { text-align: center; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <span>Inmovia</span>
                        <span>{{currentDate}}</span>
                    </div>
                    <div class="title">
                        <h2>Reporte de {{tableName}}</h2>
                    </div>
                    {{#if data.length}}
                    <table>
                        <thead>
                            <tr>
                                {{#each headers}}
                                <th>{{this}}</th>
                                {{/each}}
                            </tr>
                        </thead>
                        <tbody>
                            {{#each data}}
                            <tr>
                                {{#each this}}
                                <td>{{this}}</td>
                                {{/each}}
                            </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    {{else}}
                    <div class="no-data">No hay datos disponibles</div>
                    {{/if}}
                </body>
                </html>
            `);

            const headers = data.length > 0 ? Object.keys(data[0]) : [];
            const html = template({
                currentDate: new Date().toLocaleString(),
                tableName,
                headers,
                data: data.map(item => Object.values(item))
            });

            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Configuración del PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: {
                    top: '40px',
                    right: '20px',
                    bottom: '40px',
                    left: '20px'
                },
                printBackground: true
            });

            await browser.close();
            return Buffer.from(pdfBuffer);
        } catch (error) {
            throw new Error(`Error generando el PDF: ${error.message}`);
        }
    }

    // Función para generar el reporte en Excel (se mantiene igual)
    public async generateExcelReport(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');

        if (data?.length > 0) {
            const headers = Object.keys(data[0]);
            worksheet.columns = headers.map((header) => ({ header, key: header }));

            data.forEach((item) => {
                worksheet.addRow(item);
            });

            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const cellValue = cell.value ? cell.value.toString() : '';
                    maxLength = Math.max(maxLength, cellValue.length);
                });
                const adjustedWidth = Math.min(maxLength + 2, 20);
                column.width = adjustedWidth;
            });
        } else {
            worksheet.addRow({ message: 'No hay datos disponibles' });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    // Función para enviar los reportes por correo (se mantiene igual)
    public async sendReportByEmail(
        email: string,
        pdfBuffer: Buffer,
        excelBuffer: Buffer,
        fileName: string
    ): Promise<void> {
        const pdfFileName = `${fileName}.pdf`;
        const excelFileName = `${fileName}.xlsx`;

        const transporter = nodemailer.createTransport({
            host: process.env.MAILER_SERVICE,
            port: 2525,
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_SECRET_KEY,
            },
        });

        const mailOptions = {
            from: 'noreply@example.com',
            to: email,
            subject: `Reportes Generados de ${fileName}`,
            text: `Adjunto los reportes solicitados para la tabla ${fileName}.`,
            attachments: [
                {
                    filename: pdfFileName,
                    content: pdfBuffer,
                },
                {
                    filename: excelFileName,
                    content: excelBuffer,
                },
            ],
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente.');
        } catch (error) {
            console.error('Error enviando el correo:', error);
            throw new Error('Error enviando el correo');
        }
    }

    // Función para generar y enviar ambos reportes por correo (se mantiene igual)
    public async generateAndSendReports(data: any[], email: string, tableName: string, fileName: string): Promise<void> {
        const pdfBuffer = await this.generatePDFReport(data, tableName);
        const excelBuffer = await this.generateExcelReport(data);

        await this.sendReportByEmail(email, pdfBuffer, excelBuffer, fileName);
    }
}