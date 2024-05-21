<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UpdateEventController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/update/event/{id}', name: 'app_update_event', methods: ['GET'])]
    public function updateEvent(Request $request, Event $event): Response
    {
        // Obtener el estado actual de hasbeenmade del evento
        $currentHasBeenMade = $event->getHasBeenMade();

        // Cambiar el estado de hasbeenmade del evento
        $event->setHasBeenMade(!$currentHasBeenMade);

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        // Responder con una respuesta JSON
        return new JsonResponse(['message' => 'Estado del evento actualizado correctamente']);
    }
}


