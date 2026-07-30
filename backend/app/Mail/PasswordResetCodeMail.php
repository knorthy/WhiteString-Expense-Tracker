<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetCodeMail extends Mailable //the email itself
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $code
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Claro Password Reset Code');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.password-reset-code');
    }
}
