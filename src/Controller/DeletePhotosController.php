<?php

namespace App\Controller;

use App\Entity\Photos;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeletePhotosController extends AbstractController
{
    #[Route('/delete/photos/{id}', name: 'app_delete_photos', methods: ['DELETE'])]
    public function deletePhotos(Photos $photo, EntityManagerInterface $entityManager): Response
    {
        if (!$photo) {
            throw $this->createNotFoundException('La imagen no existe');
        }

        try {
            $entityManager->remove($photo);
            $entityManager->flush();

            return $this->json(['message' => 'Imagen eliminada correctamente'], 200);
        } catch (\Exception $e) {

            return $this->json(['error' => 'Error al eliminar la imagen: ' . $e->getMessage()], 500);
        }
    }
}
