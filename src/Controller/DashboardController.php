<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\Message;
use App\Entity\User;
use App\Form\EventType;
use App\Form\MessageType;
use App\Form\NewPasswordType;
use App\Form\UserDataType;
use App\Repository\PhotosRepository;
use App\Repository\SessionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Google\Client;
use Google\Service\Calendar\Calendar;
use Google\Service\Calendar\EventDateTime;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Service\GoogleClientProvider;

class  DashboardController extends AbstractController
{

    private $security;
    private $sessionRepository;

    private $userRepository;
    private $entityManager;

    private $googleClientProvider;


    public function __construct(Security $security, SessionRepository $sessionRepository, EntityManagerInterface $entityManager, UserRepository $userRepository, GoogleClientProvider $googleClientProvider)
    {
        $this->userRepository = $userRepository;
        $this->security = $security;
        $this->sessionRepository = $sessionRepository;
        $this->entityManager = $entityManager;
        $this->googleClientProvider = $googleClientProvider;
    }

    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(UserRepository $userRepository, SessionRepository $sessionRepository, PhotosRepository $photosRepository, Request $request, Security $security, EntityManagerInterface $entityManager, MailerInterface $mailer, SluggerInterface $slugger): Response
    {
        $nClient = $userRepository->createQueryBuilder('u')
            ->select('COUNT(u)')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '["%ROLE_USER%"]')
            ->getQuery()
            ->getSingleScalarResult();
        $nSession = $sessionRepository->count([]);
        $nPhotos = $photosRepository->count([]);

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

        if ($formEvent->isSubmitted() && $formEvent->isValid()) {

            $event->setName($formEvent->get('name')->getData());
            $event->setDate($formEvent->get('date')->getData());
            $event->setUser($formEvent->get('user')->getData());
            $event->setServices($formEvent->get('services')->getData());
            $event->setSession($formEvent->get('session')->getData());
            if (empty($formEvent->get('comment')->getData())){
                $comment = " ";
                $event->setComment($comment);
            } else {
                $event->setComment($formEvent->get('comment')->getData());
            }

            $event->setHasbeenmade("false");

            $entityManager->persist($event);
            $entityManager->flush();
            /*
            // Añadir el evento a Google Calendar
            $client = new \Google_Client();
            $client->setApplicationName('Share Album');
            $client->setScopes(\Google_Service_Calendar::CALENDAR);
            $client->setAccessType('offline');
            $client->setAuthConfig('C:\wamp64\www\shareAlbum2\client_secret_344167336176-52s75kfdes5i97ga71m6hrcal2ipgn69.apps.googleusercontent.com.json');
            $service = new \Google_Service_Calendar($client);

            $eventGoogle = new \Google_Service_Calendar_Event();
            $eventGoogle->setSummary($event->getName());
            $start = new \Google_Service_Calendar_EventDateTime();
            $start->setDateTime( $event->getDate()->format('c'));
            $eventGoogle->setStart($start);
            $end = new \Google_Service_Calendar_EventDateTime();
            $end->setDateTime($event->getDate()->modify('+1 hour')->format('c'));
            $eventGoogle->setEnd($end);

            $calendarId = 'primary';
            $eventGoogle = $service->events->insert($calendarId, $eventGoogle);
            */
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
            'nSession' => $nSession,
            'nClient' => $nClient,
            'nPhotos' => $nPhotos,
            'formEvent' => $formEvent->createView(),
            'formUserData' => $formUserData->createView(),
            'formNewPassword' => $formNewPassword->createView()
        ]);
    }

    #[Route('/send/message', name: 'app_send_message', methods: ['POST'])]
    public function sendMessage(Request $request, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $recipientId = $request->request->get('recipient');
        $subject = $request->request->get('subject');
        $textMessage = $request->request->get('textMessage');

        $file = $request->files->get('fileUrl');

        if (!$recipientId || !$subject || !$textMessage) {
            return new JsonResponse(['success' => false, 'message' => 'Hay campos son obligatorios.'], 400);
        }

        $recipient = $entityManager->getRepository(User::class)->find($recipientId);
        if (!$recipient) {
            return new JsonResponse(['success' => false, 'message' => 'El destinatario no existe.'], 400);
        }

        $message = new Message();
        $message->setRecipient($recipient);
        $message->setSubject($subject);
        $message->setTextMessage($textMessage);
        $message->setSender($this->getUser());

        if ($file) {
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $newFilename = uniqid().'.'.$file->guessExtension();

            try {
                $file->move(
                    $this->getParameter('files_directory'),
                    $newFilename
                );
                $message->setFileUrl($newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['success' => false, 'message' => 'Error al subir el archivo.'], 500);
            }
        }

        $entityManager->persist($message);
        $entityManager->flush();

        // Enviar correo electrónico
        $email = (new TemplatedEmail())
            ->from(new Address('mmcfotografia01@gmail.com', 'Moyano Fotografia'))
            ->to($recipient->getEmail())
            ->subject($subject)
            ->htmlTemplate('emails/mensaje.html.twig')
            ->context([
                'subject' => $subject,
                'message' => $textMessage,
            ]);

        if ($file) {
            $email->attachFromPath(
                $this->getParameter('files_directory').'/'.$newFilename,
                $file->getClientOriginalName()
            );
        }

        $mailer->send($email);

        return new JsonResponse(['success' => true, 'message' => 'Mensaje enviado exitosamente']);
    }
}