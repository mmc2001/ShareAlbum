<?php

namespace App\Controller;

use App\Repository\ExtrasRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ObtenerExtrasController extends AbstractController
{
    private $extrasRepository;

    public function __construct(ExtrasRepository $eventRepository)
    {
        $this->extrasRepository = $eventRepository;
    }
    #[Route('/obtener/extras', name: 'app_obtener_extras')]
    public function getExtras(): Response
    {
        // Consulta para obtener todas los eventos
        $extras = $this->extrasRepository->findAll();

        // Convertir las sesiones a un array asociativo
        $extrasArray = [];
        foreach ($extras as $extra) {
            $extrasArray[] = [
                'id' => $extra->getId(),
                'name' => $extra->getName(),
                'price' => $extra->getPriceExtra()
            ];
        }

        $extrasJson = json_encode($extrasArray);

        return new JsonResponse($extrasJson);
    }
}
