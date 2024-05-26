<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Session;
use App\Form\ClientType;
use App\Form\NewPasswordType;
use App\Form\RegistrationFormType;
use App\Form\SessionType;
use App\Form\UserDataType;
use Doctrine\ORM\EntityManagerInterface;
use http\Client;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class ClientController extends AbstractController
{
    private $em;
    private $security;
    private $entityManager;

    public function __construct(EntityManagerInterface $em, Security $security, EntityManagerInterface $entityManager){
        $this->em = $em;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    #[Route('/client', name: 'app_client')]
    public function index(Request $request, UserPasswordHasherInterface $clientPasswordHasher, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $client = new User();
        $formClient = $this->createForm(RegistrationFormType::class, $client);
        $formClient->handleRequest($request);

        $clientUpdate = $this->getUser();
        $formClientUpdate = $this->createForm(ClientType::class, $clientUpdate, [
            'allow_extra_fields' => false,
        ]);
        $formClientUpdate->handleRequest($request);

        $session = new Session();
        $formSession = $this->createForm(SessionType::class, $session);
        $formSession->handleRequest($request);

        $userData = $this->security->getUser();
        $formUserData = $this->createForm(UserDataType::class, $userData);
        $formUserData->handleRequest($request);

        $userData2 = $this->security->getUser();
        $formNewPassword = $this->createForm(NewPasswordType::class, $userData2);
        $formNewPassword->handleRequest($request);

        if ($formClient->isSubmitted() && $formClient->isValid()) {
            // Encode the plain password
            $client->setPassword(
                $clientPasswordHasher->hashPassword(
                    $client,
                    $formClient->get('plainPassword')->getData()
                )
            );

            // Additional fields
            $client->setName($formClient->get('name')->getData());
            $client->setSurnames($formClient->get('surnames')->getData());
            $client->setDni($formClient->get('dni')->getData());
            $client->setTelephone($formClient->get('telephone')->getData());
            $client->setRoles([$formClient->get('roles')->getData()]);

            $entityManager->persist($client);
            $entityManager->flush();

            // Send email to notify user
            $email = (new TemplatedEmail())
                ->from(new Address('mmcfotografia01@gmail.com', 'Moyano Fotografia'))
                ->to($client->getEmail())
                ->subject('Registro exitoso')
                ->htmlTemplate('emails/registro_exitoso.html.twig')
                ->context([
                    'username' => $client->getEmail(),
                    'password' => $formClient->get('plainPassword')->getData(),
                ]);

            $mailer->send($email);

            // Redirect to dashboard
            return $this->redirectToRoute('app_client');
        }

        if ($formClientUpdate->isSubmitted() && $formClientUpdate->isValid()) {

            $email = $formClientUpdate->get('email')->getData();
            $clientUpdate = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$clientUpdate) {
                throw $this->createNotFoundException('No se encontró el cliente actual en la base de datos');
            }

            $clientUpdate->setName($formClientUpdate->get('name')->getData());
            $clientUpdate->setSurnames($formClientUpdate->get('surnames')->getData());
            $clientUpdate->setDni($formClientUpdate->get('dni')->getData());
            $clientUpdate->setTelephone($formClientUpdate->get('telephone')->getData());
            $clientUpdate->setEmail($formClientUpdate->get('email')->getData());

            $entityManager->flush();

            return $this->redirectToRoute('app_client');
        }

        if ($formSession->isSubmitted() && $formSession->isValid()) {
            $this->em->persist($session);
            $this->em->flush();
            return $this->redirectToRoute('app_session');
        }

        if ($formUserData->isSubmitted() && $formUserData->isValid()) {

            $entityManager->persist($userData);
            $entityManager->flush();

            return $this->redirectToRoute('dashboard');
        }

        if ($formNewPassword->isSubmitted() && $formNewPassword->isValid()) {
            $newPassword = $formNewPassword->get('password')->getData();

            $this->userRepository->upgradePassword($userData2, $newPassword);
            $this->addFlash('success', 'Your password has been updated successfully.');

            $email = (new TemplatedEmail())
                ->from(new Address('mmcfotografia01@gmail.com', 'Moyano Fotografia'))
                ->to($userData2->getEmail())
                ->subject("Cambio de contraseña")
                ->htmlTemplate('emails/newpassword.html.twig')
                ->context([
                    'name' => $userData->getName(),
                ]);

            $mailer->send($email);

            $entityManager->persist($userData2);
            $entityManager->flush();

            return $this->redirectToRoute('dashboard');
        }

        return $this->render('/client/index.html.twig', [
            'formSession' => $formSession->createView(),
            'formClient' => $formClient->createView(),
            'formClientUpdate' => $formClientUpdate->createView(),
            'formUserData' => $formUserData->createView(),
            'formNewPassword' => $formNewPassword->createView()
        ]);
    }
}