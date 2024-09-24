import { User } from "@prisma/client";
import nodemailer from "nodemailer";


export class Email {
    private to: string;
    private firstName: string;
    private url: string;
    private from: string;

    constructor(user: User, url: string) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `JoBaba <${process.env.EMAIL_FROM}>`;
    }

    private newTransport() {
        if (process.env.NODE_ENV === "production") {
            return nodemailer.createTransport({
                host: process.env.SENDINBLUE_HOST,
                port: +process.env.SENDINBLUE_PORT!,
                auth: {
                    user: process.env.SENDINBLUE_LOGIN,
                    pass: process.env.SENDINBLUE_PASSWORD,
                },
            });
        } else {
            return nodemailer.createTransport({
                host: process.env.MAILTRAP_HOST,
                port: +process.env.MAILTRAP_PORT!,
                auth: {
                    user: process.env.MAILTRAP_USERNAME,
                    pass: process.env.MAILTRAP_PASSWORD,
                },
            });
        }
    }

    private async send(html: string, subject: string) {


        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: html,
        };

        await this.newTransport()?.sendMail(mailOptions)
    }

    public async sendWelcome() {

        const html = `<div>
            <h1>Welcome, ${this.firstName}!</h1>
            <p>We are thrilled to have you as part of our community. Please click the link below to verify your email and get started:</p>
            <a href="${this.url}">Verify your email</a>
        </div>
    `

        await this.send(html, ', " Welcome to JObaba the copy of AliBaba Monster :)');
    }

    public async sendPasswordReset() {
        const html = `
        <div>
            <p>Hi ${this.firstName},</p>
            <p>You requested a password reset. Click the link below to reset your password. This link is valid for 10 minutes.</p>
            <a href="${this.url}">Reset Password</a>
        </div>
    `;

        await this.send(
            html,
            `your password reset token is valid for 10 mins `,
        );
    }
}

