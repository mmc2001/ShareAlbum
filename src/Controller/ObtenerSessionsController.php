<?php

namespace App\Controller;

use App\Entity\Session;
use App\Repository\SessionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ObtenerSessionsController extends AbstractController
{
    private $sessionRepository;

    public function __construct(SessionRepository $sessionRepository)
    {
        $this->sessionRepository = $sessionRepository;
    }
    #[Route('/obtener/sessions', name: 'app_obtener_sessions')]
    public function getSessions(): Response
    {
        // Consulta para obtener todas las sesiones
        $sessions = $this->sessionRepository->findAll();

        // Convertir las sesiones a un array asociativo
        $sessionsArray = [];
        foreach ($sessions as $session) {
            $sessionsArray[] = [
                'id' => $session->getId(),
                'name' => $session->getName(),
                'service' => $session->getService(),
                'date' => $session->getDate(),
                'price' => $session->getPriceSession(),
                'description' => $session->getDescriptionSession(),
                'clients' => $session->getUsers(),
            ];
        }

        // Convierte el array a formato JSON
        $sessionsJson = json_encode($sessionsArray);

        // Retorna una respuesta JSON
        return new JsonResponse($sessionsJson);
    }
}
