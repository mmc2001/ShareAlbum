<?php

namespace App\Controller;

use App\Repository\AlbumRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ObtenerAlbumsController extends AbstractController
{
    private $albumRepository;

    public function __construct(AlbumRepository $albumRepository)
    {
        $this->albumRepository = $albumRepository;
    }

    #[Route('/obtener/albums', name: 'app_obtener_albums')]
    public function getAlbums(): Response
    {
        // Consulta para obtener todas los eventos
        $albums = $this->albumRepository->findAll();

        // Convertir las sesiones a un array asociativo
        $albumsArray = [];
        foreach ($albums as $album) {
            $albumsArray[] = [
                'id' => $album->getId(),
                'session_id' => $album->getSession()->getId(),
                'name' => $album->getName()
            ];
        }

        // Convierte el array a formato JSON
        $albumsJson = json_encode($albumsArray);

        // Retorna una respuesta JSON
        return new JsonResponse($albumsJson);
    }

    #[Route('/obtener/album/{id}', name: 'app_obtener_album')]
    public function getAlbum(int $id): Response
    {
        $albums = $this->albumRepository->findBy(['session' => $id]);

        $albumsArray = [];
        foreach ($albums as $album) {
            $albumsArray[] = [
                'id' => $album->getId(),
                'session_id' => $album->getSession()->getId(),
                'name' => $album->getName()
            ];
        }
        $albumsJson = json_encode($albumsArray);

        return new JsonResponse($albumsJson);
    }
}
