<?php

namespace App\Controller;

use App\Entity\Photos;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UpdatePhotoController extends AbstractController
{
    #[Route('/update/photo/{id}', name: 'app_update_photo', methods: ['PUT'])]
    public function updatePhotos(Photos $photo, EntityManagerInterface $entityManager): Response
    {
        if (!$photo) {
            throw $this->createNotFoundException('La foto no existe');
        }

        try {
            $photo->setHasBeenSelected(!$photo->hasBeenSelected());
            $entityManager->flush();

            return $this->json(['message' => 'Foto actualizada correctamente'], 200);
        } catch (\Exception $e) {

            return $this->json(['error' => 'Error al actualizar la foto: ' . $e->getMessage()], 500);
        }
    }
}
