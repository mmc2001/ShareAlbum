<?php

namespace App\Controller;

use App\Entity\Session;
use App\Repository\SessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UpdateSessionController extends AbstractController
{
    #[Route('/update/session', name: 'app_update_session')]
    public function updateSession(Request $request, Session $session, EntityManagerInterface $entityManager): JsonResponse
    {
        $sessionId = $request->request->get('idSession');

        // $session ya está inyectado y listo para usar en este punto

        $session->setName($request->request->get('session[name]'));
        $session->setDate($request->request->get('session[date]'));
        $session->setPriceSession($request->request->get('session[priceSession]'));
        $session->setDescription($request->request->get('session[descriptionSession]'));

        $entityManager->persist($session);
        $entityManager->flush();

        return $this->json(['success' => true, 'message' => 'Sesión actualizada exitosamente']);
    }
}
