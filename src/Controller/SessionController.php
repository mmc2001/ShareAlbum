<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Extras;
use App\Entity\Services;
use App\Entity\Session;
use App\Entity\User;
use App\Form\ExtrasType;
use App\Form\NewPasswordType;
use App\Form\ServicesType;
use App\Form\SessionType;
use App\Form\UserDataType;
use Doctrine\ORM\EntityManagerInterface;
use Illuminate\Http\JsonResponse;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;

class SessionController extends AbstractController
{
    private $em;
    private $security;
    private $entityManager;

    public function __construct(EntityManagerInterface $em, Security $security, EntityManagerInterface $entityManager){
        $this->em = $em;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    #[Route('/session', name: 'app_session')]
    public function index(Request $request, Security $security, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $session = new Session();
        $formSession = $this->createForm(SessionType::class, $session);
        $formSession->handleRequest($request);

        /*
        $sessionUpdate = null;
        $formSessionUpdate = $this->createForm(SessionType::class, $session);
        $formSessionUpdate->handleRequest($request);
        */

        $extras = new Extras();
        $formExtras = $this->createForm(ExtrasType::class, $extras);
        $formExtras->handleRequest($request);

        $services = new Services();
        $formServices = $this->createForm(ServicesType::class, $services);
        $formServices->handleRequest($request);

        $userData = $this->security->getUser();
        $formUserData = $this->createForm(UserDataType::class, $userData);
        $formUserData->handleRequest($request);

        $userData2 = $this->security->getUser();
        $formNewPassword = $this->createForm(NewPasswordType::class, $userData2);
        $formNewPassword->handleRequest($request);

        if ($formSession->isSubmitted() && $formSession->isValid()) {

            $usersForm = $formSession->get('users')->getData();
            foreach ($usersForm as $user) {
                $user->addSession($session);
                $this->em->persist($user);
            }

            $extrasForm = $formSession->get('extras')->getData();
            foreach ($extrasForm as $extra) {
                $extra->addSession($session);
                $this->em->persist($extra);
            }

            $this->em->persist($session);

            $albumNames = ['FSS', 'FE'];
            foreach ($albumNames as $albumName) {
                $album = new Album();
                $album->setName($albumName);
                $album->setSession($session);
                $this->em->persist($album);
            }

            $this->em->flush();
            return $this->redirectToRoute('app_session');
        }
        /*
        if ($formSessionUpdate->isSubmitted() && $formSessionUpdate->isValid()) {

            $sessionUpdate = $this->em->getRepository(Session::class)->find($session->getId());

            $sessionUpdate->setName($session->getName());
            $sessionUpdate->setService($session->getService());
            $sessionUpdate->setDate($session->getDate());
            $sessionUpdate->setPriceSession($session->getPriceSession());
            $sessionUpdate->setDescriptionSession($session->getDescriptionSession());

            $this->em->persist($sessionUpdate);
            $this->em->flush();
            return $this->redirectToRoute('app_session');
        }
        */
        if ($formExtras->isSubmitted() && $formExtras->isValid()) {
            $this->em->persist($extras);
            $this->em->flush();
            return $this->redirectToRoute('app_session');
        }

        if ($formServices->isSubmitted() && $formServices->isValid()) {
            $this->em->persist($services);
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

        return $this->render('/session/index.html.twig', [
            'formSession' => $formSession->createView(),
            //'formSessionUpdate' => $formSessionUpdate->createView(),
            'formExtras' => $formExtras->createView(),
            'formServices' => $formServices->createView(),
            'formUserData' => $formUserData->createView(),
            'formNewPassword' => $formNewPassword->createView()
        ]);
    }

    #[Route('/session/data', name: 'app_session_data')]
    public function data(Request $request, EntityManagerInterface $entityManager): Response
    {
        $sessions = $entityManager->getRepository(Session::class)->findAll();

        $data = [];
        foreach ($sessions as $session) {
            $data[] = [
                'column1' => $session->getName(),
                'column2' => $session->getDescription(),
            ];
        }

        return new JsonResponse($data);
    }
}
