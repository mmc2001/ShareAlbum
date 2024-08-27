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

    #[Route('/save/comment', name: 'app_save_comment')]
    public function saveComment(Request $request, EntityManagerInterface $entityManager)
    {
        $id = json_decode($request->getContent(), true)['id'];
        $comentario = json_decode($request->getContent(), true)['comentario'];

        if (!$comentario) {
            return new Response('Comentario de la foto no proporcionado', 400);
        }
        if (!$id) {
            return new Response('ID de la foto no proporcionado', 400);
        }

        // Buscar la foto por ID
        $foto = $entityManager->getRepository(Photos::class)->find($id);

        if (!$foto) {
            return new Response('Foto no encontrada', 404);
        }

        $foto->setComment($comentario);

        $entityManager->persist($foto);
        $entityManager->flush();

        return new Response('Comentario guardado con éxito', 201);
    }
}
