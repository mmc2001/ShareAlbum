<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
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
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager){
        $this->entityManager = $entityManager;
    }

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

    #[Route(path: '/comprobar/caducidad', name: 'app_comprobar_caducidad')]
    public function comprobarCaducidad(Request $request): Response
    {
        $user = $this->getUser();

        if ($user) {
            $currentDate = new \DateTime();
            if ($user->getPasswordExpiryDate() < $currentDate) {
                return $this->redirectToRoute('app_update_password');
            } else {
                if ($user->getRoles()[0] == "ROLE_USER"){
                    return $this->redirectToRoute('app_home');
                } else {
                    return $this->redirectToRoute('app_dashboard');
                }
            }
        }

        return $this->redirectToRoute('app_login');
    }

    #[Route(path: '/update/password', name: 'app_update_password')]
    public function updatePassword(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository): Response
    {
        if ($request->isMethod('POST')) {
            $user = $this->getUser();
            $newPassword = $request->request->get('new_password');
            $newPassword2 = $request->request->get('new_password2');

            if ($user instanceof User && $newPassword && $newPassword === $newPassword2) {
                $userRepository->upgradePassword($user, $newPassword);
                $user->setPasswordExpiryDate((new \DateTime())->modify('+90 days'));
                $this->addFlash('success', 'Your password has been updated successfully.');
                $entityManager->persist($user);
                $entityManager->flush();

                if ($user->getRoles()[0] == "ROLE_USER"){
                    return $this->redirectToRoute('app_home');
                } else {
                    return $this->redirectToRoute('app_dashboard');
                }
            } else {
                $this->addFlash('error', 'Las contraseñas no coinciden');
            }
        }

        return $this->render('/update_password/update_password.html.twig');
    }

}
