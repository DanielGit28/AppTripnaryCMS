import { sendEmail, sendEmailInvitacion } from '../../lib/sendgrid';

export default async function handler(req, res) {
    try {
        if (req.method === "POST") {
            await sendVerificationEmail(req, res);

        } else if (req.method === "GET") {
            if (req.query.email) {
                await sendInvitationEmail(req, res);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

const sendVerificationEmail = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        await sendEmail(email, name, password);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const sendInvitationEmail = async (req, res) => {

    const { email, name } = req.query;
    try {
        await sendEmailInvitacion(email, name);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

