# Admission Form - Colegio Puertorriqueño de Niñas

Online admission system for Colegio Puertorriqueño de Niñas.

## Features

- ✅ Complete admission form with all required fields
- ✅ Student photo upload (2x2)
- ✅ Digital signature for authorization
- ✅ Special Projects Fund acceptance
- ✅ Social security authorization
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Auto-save to localStorage
- ✅ Real-time form validation
- ✅ Colors and design aligned with CPN brand

## Quick Deployment with Vercel

### Option 1: Direct Deploy from GitHub

1. **Upload files to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CPN admission form"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cpn-admision.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a static site
   - Click "Deploy"

### Option 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Form Submission Configuration

This form needs a backend service to process submissions. There are several options:

### Option 1: Web3Forms (Free, Recommended)

1. Go to [web3forms.com](https://web3forms.com)
2. Sign up for free
3. Get your Access Key
4. In `script.js`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key:
   ```javascript
   const web3FormsKey = 'your-access-key-here';
   ```
5. Configure the email where you want to receive submissions in the Web3Forms panel

**Advantages:**
- Free up to 250 submissions/month
- No backend code needed
- Receive emails with all form data
- Supports file attachments

### Option 2: Formspree (Free/Paid)

1. Go to [formspree.io](https://formspree.io)
2. Create a new form
3. Get your form ID
4. In `script.js`, change the fetch URL to:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
       method: 'POST',
       body: formData,
       headers: {
           'Accept': 'application/json'
       }
   });
   ```

### Option 3: Custom Backend with Vercel Functions

If you want more control, you can create a serverless function:

1. Create an `api` folder in the project root
2. Create `api/submit-form.js`:

```javascript
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body;
        
        // Configure nodemailer with your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'admisiones@cpnpr.org',
            subject: 'New Admission Application',
            html: `
                <h2>New Admission Application</h2>
                <p><strong>Student:</strong> ${formData.nombre} ${formData.apellidoPaterno} ${formData.apellidoMaterno}</p>
                <p><strong>Grade:</strong> ${formData.grado}</p>
                <!-- Add more fields as needed -->
            `
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error processing form' });
    }
}
```

3. Install dependencies:
```bash
npm install nodemailer
```

4. Configure environment variables in Vercel:
   - `EMAIL_USER`: your email
   - `EMAIL_PASSWORD`: your app password

5. In `script.js`, change the fetch URL to:
```javascript
const response = await fetch('/api/submit-form', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
});
```

## File Structure

```
cpn-admision/
├── index.html          # Main form
├── styles.css          # Styles with CPN colors
├── script.js           # Form logic and digital signature
├── package.json        # Project configuration
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Customization

### Brand Colors

Colors are defined in `styles.css` using CSS variables:

```css
:root {
    --cpn-blue: #1e3a8a;           /* CPN primary blue */
    --cpn-light-blue: #3b82f6;     /* Light blue */
    --cpn-accent: #60a5fa;          /* Accent blue */
}
```

### Add/Modify Fields

To add new fields to the form:

1. Open `index.html`
2. Find the appropriate section
3. Add the new field following the existing pattern
4. Update `script.js` if special validation is needed

### Change Destination Email

The destination email is configured in your chosen backend service (Web3Forms, Formspree, etc.)

## Technical Features

- **Responsive Design:** Works perfectly on mobile, tablet, and desktop
- **Real-time validation:** Fields are validated as the user types
- **Auto-save:** Form saves automatically every 30 seconds
- **Digital Signature:** HTML5 canvas with mouse and touch support
- **Photo preview:** Shows photo before submitting
- **Accessibility:** Proper labels and keyboard navigation
- **No dependencies:** Vanilla JavaScript, no frameworks needed

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Security

- All validations are done on both client AND server
- Files are uploaded securely via HTTPS
- Digital signature is converted to PNG image
- Sensitive data (social security) is partially hidden

## Maintenance

### Update the Form

1. Make changes to files
2. Commit to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel will automatically deploy

### View Submissions

Depending on the service you use:
- **Web3Forms:** Panel at web3forms.com
- **Formspree:** Panel at formspree.io
- **Custom backend:** Configure logging/database

## Troubleshooting

### Form doesn't submit

1. Verify you've configured your Access Key in `script.js`
2. Open browser console (F12) to see errors
3. Verify backend service is working

### Images don't load

1. Verify file is a valid image (JPG, PNG, GIF)
2. Verify size doesn't exceed 5MB
3. Check browser console for errors

### Signature doesn't work

1. Verify browser supports Canvas API
2. On mobile, ensure touch events are enabled
3. Try clearing signature and signing again

## Contact and Support

For questions about the form:
- Email: cpn@cpnpr.org
- Phone: (787) 782-2618

## License

© 2024 Colegio Puertorriqueño de Niñas. All rights reserved.
