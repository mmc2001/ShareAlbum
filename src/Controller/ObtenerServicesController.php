<?php

namespace App\Controller;

use App\Repository\ServicesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Services;

class ObtenerServicesController extends AbstractController
{
    private $servicesRepository;

    public function __construct(ServicesRepository $servicesRepository)
    {
        $this->servicesRepository = $servicesRepository;
    }

    #[Route('/obtener/servicio/{id}', name: 'app_obtener_servicio')]
    public function getServices($id): JsonResponse
    {
        $servicio = $this->servicesRepository->find($id);

        if (!$servicio) {
            return new JsonResponse(['error' => 'No se encontró ningún servicio con ese ID.'], 404);
        }

        $servicesArray = [
            'id' => $servicio->getId(),
            'name' => $servicio->getName(),
        ];

        return new JsonResponse($servicesArray);
    }

    #[Route('/obtener/services', name: 'app_obtener_all_servicio')]
    public function getAllServices(): JsonResponse
    {
        $servicios = $this->servicesRepository->findAll();

        if (!$servicios) {
            return new JsonResponse(['error' => 'No se encontraron servicios.'], 404);
        }

        $servicesArray = [];
        foreach ($servicios as $servicio) {
            $servicesArray[] = [
                'id' => $servicio->getId(),
                'name' => $servicio->getName(),
            ];
        }

        return new JsonResponse($servicesArray);
    }
}