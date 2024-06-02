<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Guest;
use Cassandra\Date;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Uid\Uuid;

class GenerateTokenController extends AbstractController
{
    #[Route('/generate/token', name: 'app_generate_token', methods: ['POST'])]
    public function generateToken(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $albumData = $data['album'];

        if (!$albumData || !isset($albumData['id'])) {
            return new JsonResponse(['success' => false, 'message' => 'ID del álbum no proporcionado'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $albumId = $albumData['id'];
        $album = $entityManager->getRepository(Album::class)->find($albumId);

        try {
            $tokenString = Uuid::v4()->toRfc4122();
            $expirationDate = new \DateTime('+1 day');

            $guest = new Guest();
            $guest->setToken($tokenString);
            $guest->setAlbum($album);
            $guest->setExpirationDate($expirationDate);

            $entityManager->persist($guest);
            $entityManager->flush();

            return new JsonResponse(['success' => true, 'token' => $tokenString]);
        } catch (\Exception $e) {
            return new JsonResponse(['success' => false, 'message' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
