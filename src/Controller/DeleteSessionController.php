<?php

namespace App\Controller;

use App\Entity\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class DeleteSessionController extends AbstractController
{
    #[Route('/delete/session/{id}', name: 'app_delete_session', methods: ['DELETE'])]
    public function deleteSession(Session $session, EntityManagerInterface $entityManager): Response
    {
        // Verificar si el evento existe
        if (!$session) {
            throw $this->createNotFoundException('La sesión no existe');
        }

        try {
            // Eliminar el evento de la base de datos
            $entityManager->remove($session);
            $entityManager->flush();
            // Respuesta de éxito
            return $this->json(['message' => 'Sesión eliminada correctamente'], 200);
        } catch (\Exception $e) {
            // Si hay algún error, devolver un mensaje de error
            return $this->json(['error' => 'Error al eliminar la sesión: ' . $e->getMessage()], 500);
        }
    }
}
