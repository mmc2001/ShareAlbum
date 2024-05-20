<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeleteSessionController extends AbstractController
{
    #[Route('/delete/session', name: 'app_delete_session')]
    public function index(): Response
    {
        return $this->render('delete_session/index.html.twig', [
            'controller_name' => 'DeleteSessionController',
        ]);
    }
}
