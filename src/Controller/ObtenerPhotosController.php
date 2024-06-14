<?php

namespace App\Controller;

use App\Repository\AlbumRepository;
use App\Repository\PhotosRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ObtenerPhotosController extends AbstractController
{
    private $photosRepository;
    private $albumRepository;

    public function __construct(PhotosRepository $photosRepository, AlbumRepository $albumRepository)
    {
        $this->photosRepository = $photosRepository;
        $this->albumRepository = $albumRepository;
    }
    #[Route('/obtener/photos', name: 'app_obtener_photos')]
    public function getPhotos(): Response
    {
        $photos = $this->photosRepository->findAll();

        // Convertir las fotos a un array asociativo
        $photosArray = [];
        foreach ($photos as $photo) {
            $photosArray[] = [
                'id' => $photo->getId(),
                'photo_url' => $photo->getPhotoUrl(),
                'has_been_selected' => $photo->hasBeenSelected(),
                'comment' => $photo->getComment(),
            ];
        }

        $photosJson = json_encode($photosArray);

        return new JsonResponse($photosJson);
    }

    #[Route('/obtener/photo/{id}', name: 'app_obtener_photo')]
    public function getPhoto(int $id): Response
    {
        $album = $this->albumRepository->find($id);

        if (!$album) {
            return new JsonResponse(['error' => 'Album not found'], Response::HTTP_NOT_FOUND);
        }

        // Convertir las fotos a un array asociativo
        $photosArray = [];
        foreach ($album->getPhotos() as $photo) {
            $photosArray[] = [
                'id' => $photo->getId(),
                'photo_url' => $photo->getPhotoUrl(),
                'has_been_selected' => $photo->hasBeenSelected(),
                'comment' => $photo->getComment(),
            ];
        }

        return new JsonResponse($photosArray);
    }
}
