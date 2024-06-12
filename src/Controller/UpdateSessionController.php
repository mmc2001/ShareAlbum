<?php

namespace App\Controller;

use App\Entity\Services;
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
    public function updateSession(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $sessionId = $request->request->get('idSession');

        if (!$sessionId) {
            return $this->json(['success' => false, 'message' => 'ID de sesión no proporcionado'], 400);
        }

        $session = $entityManager->getRepository(Session::class)->find($sessionId);

        if (!$session) {
            return $this->json(['success' => false, 'message' => 'Sesión no encontrada'], 404);
        }

        $name = $request->request->get('sessionUpdate_name');
        $date = $request->request->get('sessionUpdate_date');
        $priceSession = $request->request->get('sessionUpdate_price');
        $descriptionSession = $request->request->get('sessionUpdate_description');
        $serviceId = $request->request->get('sessionUpdate_service');

        if (!$name || !$date || !$priceSession || !$descriptionSession || !$serviceId) {
            return $this->json(['success' => false, 'message' => 'Todos los campos son obligatorios'], 400);
        }

        $service = $entityManager->getRepository(Services::class)->find($serviceId);

        $session->setName($name);
        $session->setService($service);
        $session->setDate(new \DateTime($date));
        $session->setPriceSession((float)$priceSession);
        $session->setDescriptionSession($descriptionSession);

        $entityManager->flush();

        return $this->json(['success' => true, 'message' => 'Sesión actualizada exitosamente']);
    }

}
