<?php

namespace App\Controller;

use Cloudinary\Cloudinary;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UploadImageController extends AbstractController
{
    #[Route('/upload/image', name: 'app_upload_image', methods: ['POST'])]
    public function uploadImage(Request $request): Response
    {
        $file = $request->files->get('image');

        if (!$file) {
            return $this->json(['error' => 'No file uploaded.'], 400);
        }

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
                'api_key' => $_ENV['CLOUDINARY_API_KEY'],
                'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
            ],
        ]);

        try {
            // Desactivar la verificación del certificado SSL con cURL
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                'public_id' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'folder' => 'ShareAlbum',
            ]);

            curl_close($ch);

            return $this->json([
                'message' => 'Image uploaded successfully.',
                'url' => $result['secure_url'],
            ]);

        } catch (\Exception $exception) {
            return $this->json(['error' => $exception->getMessage()], 500);
        }
    }
}
