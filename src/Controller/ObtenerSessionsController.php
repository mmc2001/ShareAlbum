<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ObtenerSessionsController extends AbstractController
{
    #[Route('/obtener/sessions', name: 'app_obtener_sessions')]
    public function index(): Response
    {
        return $this->render('obtener_sessions/index.html.twig', [
            'controller_name' => 'ObtenerSessionsController',
        ]);
    }
}
