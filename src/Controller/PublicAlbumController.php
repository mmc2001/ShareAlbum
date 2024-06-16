<?php

namespace App\Controller;

use App\Repository\AlbumRepository;
use App\Repository\GuestRepository;
use App\Repository\SessionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PublicAlbumController extends AbstractController
{
    #[Route('/public/album', name: 'app_public_album')]
    public function publicAlbum(Request $request, GuestRepository $guestRepository, AlbumRepository $albumRepository, SessionRepository $sessionRepository): Response
    {

        $token = $request->query->get('token');

        if (!$token) {
            return $this->render('/public_album/error.html.twig', [
                'message' => 'Token no proporcionado.',
            ]);
        }

        $guest = $guestRepository->findOneBy(['token' => $token]);

        if (!$guest) {
            return $this->render('/public_album/error.html.twig', [
                'message' => 'Token no válido.',
            ]);
        }

        $currentDate = new \DateTime();
        if ($guest->getExpirationDate() < $currentDate) {
            return $this->render('/public_album/error.html.twig', [
                'message' => 'El token ha caducado.',
            ]);
        }

        $albumId = $guest->getAlbum()->getId();
        $album = $albumRepository->find($albumId);
        $sessionId = $album->getSession();
        $session = $sessionRepository->find($sessionId);

        return $this->render('public_album/index.html.twig', [
            'controller_name' => 'PublicAlbumController',
            'session_name' => $session->getName(),
            'session_id' => $sessionId->getId(),
        ]);
    }
}
