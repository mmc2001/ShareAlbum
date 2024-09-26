<?php

namespace App\Controller;

use App\Entity\Album;
use App\Entity\Event;
use App\Entity\Guest;
use App\Entity\Photos;
use App\Entity\Session;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class DeleteSessionController extends AbstractController
{
    #[Route('/delete/session/{id}', name: 'app_delete_session', methods: ['DELETE'])]
    public function deleteSession(Session $session, EntityManagerInterface $entityManager): Response
    {
        if (!$session) {
            throw $this->createNotFoundException('La sesión no existe');
        }

        try {

            $events = $entityManager->getRepository(Event::class)->findBy(['session' => $session]);
            foreach ($events as $event) {
                $entityManager->remove($event);
            }

            $albums = $entityManager->getRepository(Album::class)->findBy(['session' => $session]);

            foreach ($albums as $album) {
                $photos = $album->getPhotos();

                foreach ($photos as $photo) {
                    $entityManager->remove($photo);
                }

                $guests = $entityManager->getRepository(Guest::class)->findBy(['album' => $album]);
                foreach ($guests as $guest) {
                    $entityManager->remove($guest);
                }

                $entityManager->remove($album);
            }

            $entityManager->remove($session);
            $entityManager->flush();

            return $this->json(['message' => 'Sesión, álbumes y fotos asociados eliminados correctamente'], 200);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al eliminar la sesión: ' . $e->getMessage()], 500);
        }
    }
}
