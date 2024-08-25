<?php

namespace App\Controller;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

class SendEmailController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    #[Route('/send/email', name: 'app_send_email')]
    public function sendEmail(Request $request, MailerInterface $mailer): Response
    {
        $user = $this->security->getUser();

        $data = json_decode($request->getContent(), true);

        $subject = $data['subject'] ?? null;
        $message = $data['message'] ?? null;

        $email = (new TemplatedEmail())
            ->from(new Address($user->getEmail(), $user->getFullName()))
            ->to("mmcfotografia01@gmail.com")
            ->subject($subject)
            ->htmlTemplate('emails/mensaje.html.twig')
            ->context([
                'subject' => $subject,
                'message' => $message,
            ]);

        $mailer->send($email);

        return $this->json(['status' => 'success', 'message' => 'Correo enviado correctamente']);
    }
}
