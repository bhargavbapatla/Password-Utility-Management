import axios from 'axios';

export const sendToSlack = async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'No password provided.' });
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        return res.status(503).json({ error: 'Slack integration is not configured on the server.' });
    }

    try {
        // ||text|| is Slack spoiler syntax — hides the password until the user clicks it
        await axios.post(webhookUrl, {
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `🔐 *New generated password* _(click to reveal)_:\n||\`${password}\`||`,
                    },
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'mrkdwn',
                            text: '⚠️ Do not share this message publicly. Delete after use.',
                        },
                    ],
                },
            ],
        });

        // Never log the password in plaintext
        console.log('[Slack] Password delivered to Slack channel [REDACTED]');
        res.json({ success: true });
    } catch (err) {
        console.error('[Slack] Failed to send message:', err.message);
        res.status(502).json({ error: 'Failed to deliver message to Slack.' });
    }
};
