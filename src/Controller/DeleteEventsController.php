<?php

namespace App\Controller;

use App\Entity\Event;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class DeleteEventsController extends AbstractController
{
    #[Route('/delete/evento/{id}', name: 'app_delete_evento')]
    public function deleteEvento(Event $evento, EntityManagerInterface $entityManager): Response
    {
        // Verificar si el evento existe
        if (!$evento) {
            throw $this->createNotFoundException('El evento no existe');
        }

        try {
            // Eliminar el evento de la base de datos
            $entityManager->remove($evento);
            $entityManager->flush();
            // Respuesta de éxito
            return $this->json(['message' => 'Evento eliminado correctamente'], 200);
        } catch (\Exception $e) {
            // Si hay algún error, devolver un mensaje de error
            return $this->json(['error' => 'Error al eliminar el evento: ' . $e->getMessage()], 500);
        }
    }
}
