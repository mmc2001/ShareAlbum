<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ObtenerClientsController extends AbstractController
{
    private $userRepository;

    public function __construct(UserRepository $eventRepository)
    {
        $this->userRepository = $eventRepository;
    }
    #[Route('/obtener/clients', name: 'app_obtener_clients')]
    public function getClients(): Response
    {
        $clients = $this->userRepository->findAll();

        $clientsArray = [];
        foreach ($clients as $client) {
            $clientsArray[] = [
                'id' => $client->getId(),
                'name' => $client->getName(),
                'surnames' => $client->getSurnames(),
                'dni' => $client->getDni(),
                'telephone' => $client->getTelephone(),
                'email' => $client->getEmail()
            ];
        }

        // Convierte el array a formato JSON
        $clientsJson = json_encode($clientsArray);

        // Retorna una respuesta JSON
        return new JsonResponse($clientsJson);
    }
}
