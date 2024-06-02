<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Photos;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SavePhotosController extends AbstractController
{
    #[Route('/save/photos', name: 'app_save_photos')]
    public function savePhotos(Request $request, EntityManagerInterface $entityManager)
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['imagenes']) || !isset($data['albumId'])) {
            return new Response('No se han proporcionado imágenes o ID del álbum', 400);
        }

        $imagenes = $data['imagenes'];
        $albumId = $data['albumId'];

        // Buscar el álbum por ID
        $album = $entityManager->getRepository(Album::class)->find($albumId);

        if (!$album) {
            return new Response('Álbum no encontrado', 404);
        }

        foreach ($imagenes as $imagen) {
            $entity = new Photos();
            $entity->setPhotoUrl($imagen);
            $entity->setHasBeenSelected(false);
            $entity->setComment('');
            $entity->addAlbum($album);

            $entityManager->persist($entity);
        }

        $entityManager->flush();

        return new Response('Imágenes guardadas con éxito', 201);
    }
}
