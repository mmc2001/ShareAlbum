<?php

namespace App\Controller;

use App\Form\NewPasswordType;
use App\Form\UserDataType;
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

class AlbumClientController extends AbstractController
{
    private $em;
    private $security;
    private $entityManager;

    public function __construct(EntityManagerInterface $em, Security $security, EntityManagerInterface $entityManager){
        $this->em = $em;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    #[Route('/album/client/{id}', name: 'app_album_client')]
    public function index(Request $request, UserPasswordHasherInterface $clientPasswordHasher, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {

        $userData = $this->security->getUser();
        $formUserData = $this->createForm(UserDataType::class, $userData);
        $formUserData->handleRequest($request);

        $userData2 = $this->security->getUser();
        $formNewPassword = $this->createForm(NewPasswordType::class, $userData2);
        $formNewPassword->handleRequest($request);

        $cloudName = $_ENV['CLOUDINARY_CLOUD_NAME'];

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

        return $this->render('album_client/index.html.twig', [
            'controller_name' => 'AlbumsController',
            'cloudName' => json_encode($cloudName),
            'formUserData' => $formUserData->createView(),
            'formNewPassword' => $formNewPassword->createView()
        ]);
    }
}
