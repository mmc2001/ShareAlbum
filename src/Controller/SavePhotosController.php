<?php

namespace App\Controller;

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

        if (!$data || !isset($data['imagenes'])) {
            return new Response('No se han proporcionado imágenes', 400);
        }

        $imagenes = $data['imagenes'];

        foreach ($imagenes as $imagen) {
            $entity = new Photos();
            $entity->setPhotoUrl($imagen);
            $entity->setHasBeenSelected(false);
            $entity->setComment('');
            $entityManager->persist($entity);
        }

        $entityManager->flush();

        return new Response('Imágenes guardadas con éxito', 201);
    }
}
