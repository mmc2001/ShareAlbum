<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ObtenerEventsController extends AbstractController
{
    private $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }
    #[Route('/obtener/events', name: 'app_obtener_events')]
    public function getEvents(): Response
    {
        // Consulta para obtener todas los eventos
        $events = $this->eventRepository->findAll();

        // Convertir las sesiones a un array asociativo
        $eventsArray = [];
        foreach ($events as $event) {
            $eventsArray[] = [
                'id' => $event->getId(),
                'services_id' => $event->getServices(),
                'user' => $event->getUser(),
                'name' => $event->getName(),
                'date' => $event->getDate(),
                'comment' => $event->getComment(),
                'hasbeenmade' => $event->getHasbeenmade()
            ];
        }

        // Convierte el array a formato JSON
        $eventsJson = json_encode($eventsArray);

        // Retorna una respuesta JSON
        return new JsonResponse($eventsJson);
    }
}