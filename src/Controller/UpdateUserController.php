<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UpdateUserController extends AbstractController
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/update/user', name: 'app_update_user')]
    public function updateUser(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $userId = $request->request->get('idUser');

        if (!$userId) {
            return $this->json(['success' => false, 'message' => 'ID de sesión no proporcionado'], 400);
        }

        $user = $entityManager->getRepository(User::class)->find($userId);

        if (!$user) {
            return $this->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        $name = $request->request->get('userUpdate_name');
        $surnames = $request->request->get('userUpdate_surnames');
        $dni = $request->request->get('userUpdate_dni');
        $telephone = $request->request->get('userUpdate_telephone');
        $email = $request->request->get('userUpdate_email');
        $password = $request->request->get('userUpdate_password');

        if (!$name || !$surnames || !$dni || !$telephone || !$email) {
            return $this->json(['success' => false, 'message' => 'Todos los campos son obligatorios'], 400);
        }

        $user->setName($name);
        $user->setSurnames($surnames);
        $user->setDni($dni);
        $user->setTelephone($telephone);
        $user->setEmail($email);

        if ($password) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashedPassword);
        }

        $entityManager->flush();

        return $this->json(['success' => true, 'message' => 'Sesión actualizada exitosamente']);
    }
}
