<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ObtenerClientsController extends AbstractController
{
    #[Route('/obtener/clients', name: 'app_obtener_clients')]
    public function index(): Response
    {
        return $this->render('obtener_clients/index.html.twig', [
            'controller_name' => 'ObtenerClientsController',
        ]);
    }
}
