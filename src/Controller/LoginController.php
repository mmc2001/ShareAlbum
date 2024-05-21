<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('login/login2.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/solicitar-cuenta', name: 'app_solicitar_cuenta', methods: ['POST'])]
    public function solicitarCuenta(Request $request, MailerInterface $mailer): Response
    {
        // Recuperar datos del formulario
        $username = $request->request->get('_username');
        $useremail = $request->request->get('_useremail');
        $usertel = $request->request->get('_usertel');
        $servicio = $request->request->get('servicios');

        // Enviar correo electrónico
        $email = (new TemplatedEmail())
            ->from(new Address($useremail, $username))
            ->to('mmcfotografia01@gmail.com')
            ->subject('Solicitud de cuenta')
            ->htmlTemplate('emails/solicitud_cuenta.html.twig')
            ->context([
                'username' => $username,
                'useremail' => $useremail,
                'usertel' => $usertel,
                'servicio' => $servicio,
            ]);

        $mailer->send($email);

        // Redirigir a donde desees después de enviar el formulario
        return $this->redirectToRoute('app_login');
    }

}
