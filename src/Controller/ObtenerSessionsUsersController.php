<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\SessionRepository;
use Symfony\Component\HttpFoundation\JsonResponse;

class ObtenerSessionsUsersController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    #[Route('/obtener/sessions/user', name: 'app_obtener_sessions_users')]
    public function getSessionsUser(UserRepository $userRepository, Security $security): Response
    {
        $user = $this->security->getUser();

        $sessions = $user->getSession();

        // Convertir las sesiones a un array asociativo
        $sessionsArray = [];
        foreach ($sessions as $session) {
            $users = [];
            foreach ($session->getUsers() as $user) {
                $users[] = $user->getName() . ' ' . $user->getSurnames();
            }
            $usersString = implode(', ', $users);

            $extras = [];
            foreach ($session->getExtras() as $extra) {
                $extras[] = $extra->getName();
            }
            $extrasString = implode(', ', $extras);

            $sessionsArray[] = [
                'id' => $session->getId(),
                'name' => $session->getName(),
                'service' => $session->getService()->getName(),
                'extras' => $extrasString,
                'date' => $session->getDate()->format('Y-m-d H:i:s'), // Asegúrate de que la fecha esté en un formato legible
                'price' => $session->getPriceSession(),
                'description' => $session->getDescriptionSession(),
                'clients' => $usersString,
            ];
        }
        // Retorna una respuesta JSON
        return new JsonResponse($sessionsArray);
    }
}
