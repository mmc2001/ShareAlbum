<?php

namespace App\Controller;

use App\Repository\GuestRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PublicAlbumController extends AbstractController
{
    #[Route('/public/album', name: 'app_public_album')]
    public function publicAlbum(Request $request, GuestRepository $guestRepository): Response
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

        //$albumId = $guest->getAlbum()->getId();
        // $albumRepository = ... obtén el repository de tu entidad Album
        // $album = $albumRepository->find($albumId);

        return $this->render('public_album/index.html.twig', [
            'controller_name' => 'PublicAlbumController',
            //'albumId' => $albumId,
        ]);
    }
}
