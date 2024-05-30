<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Guest;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;
//use App\Service\TokenGenerator;

class GenerateTokenController extends AbstractController
{
    #[Route('/generate/token/{id}', name: 'app_generate_token')]
    /*
    public function generateToken(Request $request)
    {
        $username = 'invited_user_'. uniqid();
        $expiresAt = new \DateTime('+1 hour'); // Token válido por 1 hora

        $token = $this->tokenGenerator->generateToken($username, $expiresAt);

        $url = $this->generateUrl('app_login', ['token' => $token]);

        return new Response($url);
    }
    */
    public function generateToken(Album $album, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (empty($data['access']) || $data['access'] !== 'guest') {
            return new JsonResponse(['success' => false, 'message' => 'Acceso inválido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $tokenString = Uuid::v4()->toRfc4122();
        $guest = new Guest();
        $guest->setToken($tokenString);
        $guest->setAlbum($album->getId());
        $guest->setTokenHasBeenUsed(false);

        $entityManager->persist($guest);
        $entityManager->flush();

        return new JsonResponse(['success' => true, 'token' => $tokenString]);
    }
}
