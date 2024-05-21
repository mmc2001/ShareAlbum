<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, Security $security, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            // Additional fields
            $user->setName($form->get('name')->getData());
            $user->setSurnames($form->get('surnames')->getData());
            $user->setDni($form->get('dni')->getData());
            $user->setTelephone($form->get('telephone')->getData());
            $user->setRoles([$form->get('roles')->getData()]);

            $entityManager->persist($user);
            $entityManager->flush();

            // Send email to notify user
            $email = (new TemplatedEmail())
                ->from(new Address('mmcfotografia01@gmail.com', 'Moyano Fotografia'))
                ->to($user->getEmail())
                ->subject('Registro exitoso')
                ->htmlTemplate('emails/registro_exitoso.html.twig')
                ->context([
                    'username' => $user->getEmail(),
                    'password' => $form->get('plainPassword')->getData(),
                ]);

            $mailer->send($email);

            // Redirect to dashboard
            return $this->redirectToRoute('app_register');
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form,
        ]);
    }
}
