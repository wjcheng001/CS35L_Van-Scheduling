import smtplib
import ssl
import secrets
import string
from email.message import EmailMessage
from email_validator import validate_email, EmailNotValidError

# Function to check if an email is a valid @ucla.edu address
def is_valid_ucla_email(email):
    try:
        valid = validate_email(email)
        return valid.email.endswith("@ucla.edu")
    except EmailNotValidError:
        return False

# Generate a secure 6-digit verification code
def generate_verification_code(length=6):
    return ''.join(secrets.choice(string.digits) for _ in range(length))

# Send email
def send_verification_email(recipient_email, code, sender_email, sender_password):
    if not is_valid_ucla_email(recipient_email):
        raise ValueError("Email must be a valid @ucla.edu address")

    message = EmailMessage()
    message['Subject'] = 'Your UCLA Email Verification Code'
    message['From'] = sender_email
    message['To'] = recipient_email
    message.set_content(f"Your verification code is: {code}")

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
        server.login(sender_email, sender_password)
        server.send_message(message)
        print(f"Verification code sent to {recipient_email}")