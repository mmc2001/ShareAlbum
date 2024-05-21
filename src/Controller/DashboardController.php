<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Event;
use App\Entity\Message;
use App\Form\EventType;
use App\Form\MessageType;
use App\Form\NewPasswordType;
use App\Form\UserDataType;
use App\Repository\AlbumRepository;
use App\Repository\PhotosRepository;
use App\Repository\SessionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{

    private $security;
    private $sessionRepository;

    private $userRepository;
    private $entityManager;


    public function __construct(Security $security, SessionRepository $sessionRepository, EntityManagerInterface $entityManager, UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
        $this->security = $security;
        $this->sessionRepository = $sessionRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(UserRepository $userRepository, AlbumRepository $albumRepository, PhotosRepository $photosRepository, Request $request, Security $security, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $nClient = $userRepository->createQueryBuilder('u')
            ->select('COUNT(u)')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '["%ROLE_USER%"]')
            ->getQuery()
            ->getSingleScalarResult();
        $nAlbum = $albumRepository->count([]);
        $nPhotos = $photosRepository->count([]);

        $message = new Message();
        $formMessage = $this->createForm(MessageType::class, $message);
        $formMessage->handleRequest($request);

        $event = new Event();
        $formEvent = $this->createForm(EventType::class, $event);
        $formEvent->handleRequest($request);

        $userData = $this->security->getUser();
        $formUserData = $this->createForm(UserDataType::class, $userData);
        $formUserData->handleRequest($request);

        $userData2 = $this->security->getUser();
        $formNewPassword = $this->createForm(NewPasswordType::class, $userData2);
        $formNewPassword->handleRequest($request);

        $user = $this->security->getUser();

        if ($formMessage->isSubmitted() && $formMessage->isValid()) {

            $message->setRecipient($formMessage->get('recipient')->getData());
            $message->setSubject($formMessage->get('subject')->getData());
            $message->setFileUrl($formMessage->get('file')->getData());
            $message->setTextMessage($formMessage->get('textMessage')->getData());
            $message->setSender($user);

            $entityManager->persist($message);
            $entityManager->flush();

            // Send email to notify user
            $email = (new TemplatedEmail())
                ->from(new Address('mmcfotografia01@gmail.com', 'Moyano Fotografia'))
                ->to($message->getRecipient()->getEmail())
                ->subject($message->getSubject())
                ->htmlTemplate('emails/mensaje.html.twig')
                ->context([
                    'subject' => $message->getSubject(),
                    'message' => $message->getTextMessage(),
                ]);

            $mailer->send($email);

            return $this->redirectToRoute('app_dashboard');
        }

        if ($formEvent->isSubmitted() && $formEvent->isValid()) {

            $event->setName($formEvent->get('name')->getData());
            $event->setDate($formEvent->get('date')->getData());
            $event->setUser($formEvent->get('user')->getData());
            $event->setServices($formEvent->get('services')->getData());
            $event->setSession($formEvent->get('session')->getData());
            if (empty($formEvent->get('comment')->getData())){
                $comment = " "; // No necesitas establecer el comentario como espacio vacío aquí
                $event->setComment($comment); // Esta línea se puede eliminar
            } else {
                $event->setComment($formEvent->get('comment')->getData());
            }

            $event->setHasbeenmade("false");

            $entityManager->persist($event);
            $entityManager->flush();

            return $this->redirectToRoute('app_dashboard');
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

        return $this->render('dashboard/index.html.twig', [
            'user' => $user,
            'nAlbum' => $nAlbum,
            'nClient' => $nClient,
            'nPhotos' => $nPhotos,
            'formMessage' => $formMessage->createView(),
            'formEvent' => $formEvent->createView(),
            'formUserData' => $formUserData->createView(),
            'formNewPassword' => $formNewPassword->createView()
        ]);
    }
}