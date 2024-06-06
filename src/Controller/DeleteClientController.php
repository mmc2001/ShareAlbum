<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Session;
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
        // Obtener el cliente por su ID
        $client = $entityManager->getRepository(User::class)->find($client);

        if (!$client) {
            throw $this->createNotFoundException('El cliente no existe');
        }

        try {

            // Eliminar los álbumes asociados a las sesiones del cliente
            foreach ($client->getSession() as $session) {
                foreach ($session->getAlbum() as $album) {
                    $entityManager->remove($album);
                }
                $entityManager->remove($session);
            }

            // Eliminar los mensajes asociados al cliente
            foreach ($client->getMessageRecipient() as $message) {
                $entityManager->remove($message);
            }

            // Eliminar usuario cliente
            $entityManager->remove($client);
            $entityManager->flush();

            return $this->json(['message' => 'Cliente eliminado correctamente'], 200);
        } catch (\Exception $e) {

            return $this->json(['error' => 'Error al eliminar el cliente: ' . $e->getMessage()], 500);
        }
    }
}
