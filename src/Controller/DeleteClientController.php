<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeleteClientController extends AbstractController
{
    #[Route('/delete/client/{id}', name: 'app_delete_client', methods: ['DELETE'])]
    public function deleteClient(User $client, EntityManagerInterface $entityManager): Response
    {
        if (!$client) {
            throw $this->createNotFoundException('El cliente no existe');
        }

        try {
            $entityManager->remove($client);
            $entityManager->flush();

            return $this->json(['message' => 'Cliente eliminado correctamente'], 200);
        } catch (\Exception $e) {

            return $this->json(['error' => 'Error al eliminar el cliente: ' . $e->getMessage()], 500);
        }
    }
}
