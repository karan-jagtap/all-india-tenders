"""
Feedback and Contact Us Service
Stores feedback submissions in SQLite database and dispatches email notifications to kmessilj@gmail.com.
"""

import os
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

try:
    from dotenv import load_dotenv
    # Load backend/.env if present
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    load_dotenv(env_path)
except ImportError:
    pass

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "all_india_tenders.db"))
RECIPIENT_EMAIL = "kmessilj@gmail.com"

def get_db_connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_feedback_db():
    """Initializes the feedback SQLite database and tables."""
    conn = get_db_connection()
    try:
        with conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS feedback_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT,
                    subject TEXT,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    email_recipient TEXT DEFAULT 'kmessilj@gmail.com',
                    email_status TEXT DEFAULT 'PENDING',
                    email_error TEXT
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback_submissions(created_at)")
    finally:
        conn.close()

# Initialize database schema on module load
init_feedback_db()

def send_notification_email(
    name: str,
    email: str,
    phone: Optional[str],
    subject: Optional[str],
    message: str,
    submission_id: int
) -> Tuple[bool, str]:
    """
    Sends email notification to kmessilj@gmail.com.
    Uses SMTP credentials from environment variables if present.
    If credentials are not configured, logs the email to console and marks as queued/saved.
    """
    try:
        from dotenv import load_dotenv
        env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
        load_dotenv(env_path, override=True)
    except Exception:
        pass

    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_password = (os.environ.get("SMTP_PASSWORD") or os.environ.get("SMTP_PASS") or "").strip().replace(" ", "")
    smtp_from = os.environ.get("SMTP_FROM", smtp_user or "notifications@allindiatenders.in").strip()
    
    sub_title = subject or "Platform Inquiry / User Feedback"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

    plain_text = f"""Hello,

A new Feedback / Contact Us submission has been received on All India Tenders platform.

Submission Details:
--------------------------------------------------
ID: #{submission_id}
Name: {name}
Email: {email}
Phone / WhatsApp: {phone or 'Not provided'}
Subject / Category: {sub_title}
Received At: {now_str}

User Message:
--------------------------------------------------
{message}
--------------------------------------------------

Database Record: Recorded in all_india_tenders.db (ID: {submission_id})
Recipient: {RECIPIENT_EMAIL}
"""

    html_text = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }}
        .card {{ background: #ffffff; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 16px; }}
        .badge {{ background: #ffedd5; color: #9a3412; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }}
        .field {{ margin-bottom: 12px; font-size: 14px; }}
        .label {{ font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }}
        .val {{ font-weight: 600; color: #0f172a; margin-top: 2px; }}
        .msg-box {{ background: #f1f5f9; border-left: 4px solid #ea580c; padding: 14px; border-radius: 6px; margin-top: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }}
        .footer {{ margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">All India Tenders</span>
          <h2 style="margin: 8px 0 0 0; color: #0f172a; font-size: 18px;">New Feedback / Contact Submission</h2>
        </div>
        <div class="field">
          <div class="label">From</div>
          <div class="val">{name} &lt;<a href="mailto:{email}">{email}</a>&gt;</div>
        </div>
        <div class="field">
          <div class="label">Phone / WhatsApp</div>
          <div class="val">{phone or 'Not provided'}</div>
        </div>
        <div class="field">
          <div class="label">Subject</div>
          <div class="val">{sub_title}</div>
        </div>
        <div class="field">
          <div class="label">Submitted At</div>
          <div class="val">{now_str} (Submission ID: #{submission_id})</div>
        </div>
        <div class="label" style="margin-top: 16px;">Message Content</div>
        <div class="msg-box">{message}</div>
        <div class="footer">
          This notification was automatically dispatched to {RECIPIENT_EMAIL} upon submission on All India Tenders.
        </div>
      </div>
    </body>
    </html>
    """

    # If SMTP is configured with user & password
    if smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"[All India Tenders] New Feedback: {sub_title} from {name}"
            msg["From"] = smtp_from
            msg["To"] = RECIPIENT_EMAIL
            msg["Reply-To"] = email

            msg.attach(MIMEText(plain_text, "plain", "utf-8"))
            msg.attach(MIMEText(html_text, "html", "utf-8"))

            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
            else:
                server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
                server.starttls()

            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, [RECIPIENT_EMAIL], msg.as_string())
            server.quit()
            return True, "SENT"
        except Exception as e:
            err_msg = f"SMTP error: {str(e)}"
            print(f"[Feedback Notification] {err_msg}")
            return False, err_msg
    else:
        # SMTP credentials not configured in environment
        # Securely log notification to console and record in DB
        print(f"\n{'='*70}\n[FEEDBACK NOTIFICATION TO: {RECIPIENT_EMAIL}]\n{plain_text}\n{'='*70}\n")
        return True, "RECORDED_IN_DB_SMTP_NOT_CONFIGURED"


def save_feedback(
    name: str,
    email: str,
    message: str,
    phone: Optional[str] = None,
    subject: Optional[str] = None
) -> Dict[str, Any]:
    """
    Saves a feedback submission to the SQLite database and triggers email notification.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO feedback_submissions (name, email, phone, subject, message, email_recipient)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name.strip(), email.strip(), (phone or "").strip() or None, (subject or "").strip() or None, message.strip(), RECIPIENT_EMAIL))
        submission_id = cursor.lastrowid
        conn.commit()

        # Attempt to dispatch notification
        success, email_status = send_notification_email(name, email, phone, subject, message, submission_id)

        # Update email status in database
        cursor.execute("""
            UPDATE feedback_submissions
            SET email_status = ?, email_error = ?
            WHERE id = ?
        """, (email_status, None if success else email_status, submission_id))
        conn.commit()

        return {
            "id": submission_id,
            "name": name,
            "email": email,
            "subject": subject,
            "recipient": RECIPIENT_EMAIL,
            "email_status": email_status,
            "created_at": datetime.now().isoformat()
        }
    finally:
        conn.close()


def list_recent_feedback(limit: int = 50) -> List[Dict[str, Any]]:
    """Returns recent feedback submissions from the SQLite database."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, email, phone, subject, message, created_at, email_recipient, email_status
            FROM feedback_submissions
            ORDER BY id DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()
