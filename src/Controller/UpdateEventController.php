<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UpdateEventController extends AbstractController
{
    #[Route('/update/event', name: 'app_update_event')]
    public function index(): Response
    {
        return $this->render('update_event/index.html.twig', [
            'controller_name' => 'UpdateEventController',
        ]);
    }
}
