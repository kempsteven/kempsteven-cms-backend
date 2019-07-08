const nodemailer = require('nodemailer')

exports.send_email = async (req, res, next) => {
	// if (
	// 	req.headers['origin'] && req.headers['origin'] !== 'https://kempsteven.ga' &&
	// 	req.headers['referer'] && req.headers['referer'] !== 'https://kempsteven.ga/contact'
	// ) {
	// 	return res.status(401).json({
	// 		message: 'Authentication failed.'
	// 	})
	// }

	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	if (!regEx.test(req.body.email)) {
		return res.status(200).json({
			status: 406,
			message: 'You sent an invalid email!'
		})
	}

    const emailTemplate = `
		<html>
		<head>
			<style type="text/css">
				html, body {
					width: 100%;
				}

				* {
					box-sizing: border-box;
		    		word-break: break-word;
		    		word-wrap: break-word;
		    		font-family: sans-serif;
		    		color: #878787;
				}

				.container {
					width: 450px;
					border-radius: 5px;
					margin: 0 auto;
					background: #fff;
					border: 1px solid #878787;
				}

				.container .header {
					display: block;
					width: 100%;
					text-align: center;
					margin: 0;
					background: #4286f4;
					color: #fff;
					padding: 15px 0;
					border-top-left-radius: 5px;
					border-top-right-radius: 5px;
					font-size: 18px;
				}

				.container .contact-header {
					display: block;
					margin-bottom: 10px;
					padding: 0 20px;
					font-size: 16px;
				}

				.container .contact-details {
					list-style: none;
					padding: 0 20px;
					margin: 0;
				}

				.container .contact-details li {
					padding: 0px 0 15px 0;
					margin: 0;
				}

				.container .contact-details li .detail-name {
					font-weight: 600;
					margin-right: 5px;
					display: inline-block;
					font-size: 16px;
				}

				.container .contact-details li .detail-desc {
					margin-right: 5px;
					display: inline-block;
					font-size: 14px;
					padding: 5px 10px;
					border-radius: 5px;
					background: #4286f4;
					color: #fff;
					min-width: 120px;
				}

				.container .contact-details li .detail-desc a{
					color: #fff;
				}

				.contact-message {
					margin: 0;
					padding: 0 20px;
				}

				.message {
					border: 1px solid #4286f4;
					padding: 10px;
					margin: 15px 20px 20px 20px;
					border-radius: 5px;
					background: #4286f4;
					color: #fff;
					font-size: 14px;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h3 class="header">Kemp Steven | Contact Us</h3>

				<h3 class="contact-header">Contact Details</h3>

				<ul class="contact-details">
					<li>
						<span class="detail-name">
							 Name:
						</span>

						<span class="detail-desc">
							${req.body.name}
						</span>
					</li>

					<li>
						<span class="detail-name">
							 Email:
						</span>
						
						<span class="detail-desc">
							${req.body.email}
						</span>
					</li>

					<li>
						<span class="detail-name">
							 Subject:
						</span>
						
						<span class="detail-desc">
							${req.body.subject}
						</span>
					</li>
			 	</ul>

			 	<h3 class="contact-message">Message</h3>
			 	<div class="message">
			 		${req.body.message}
			 	</div>
			</div>
		</body>
		</html>
	`

	const email = process.env.EMAIL_AUTH_USER
	const clientId = process.env.EMAIL_AUTH_CLIENT_ID
	const clientSecret = process.env.EMAIL_AUTH_CLIENT_SECRET
	const refreshToken = process.env.EMAIL_AUTH_REFRESH_TOKEN
	
	const auth = {
		type: 'oauth2',
		user: email,
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: refreshToken,
	};
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        // port: 587,
        port: 465,
        secure: true, // true for 465, false for other ports
		auth: auth
    })

    // send mail with defined transport object
    transporter.sendMail({
        from: "Kemp Steven | Contact Us", // sender address
        to: "kemp@kemp.ga", // list of receivers
        subject: "Kemp Steven | Contact Us", // Subject line
        html: emailTemplate // html body
    }).then(result => {
        return res.status(200).json({
			status: 200,
            message: 'Message Sent'
        })
    }).catch(error => {
        return res.status(200).json({
			status: 406,
            message: error
        })
    })
}