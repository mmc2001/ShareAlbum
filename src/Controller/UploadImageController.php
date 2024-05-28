<?php

namespace App\Controller;

//require './vendor/autoload.php';

use Cloudinary\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UploadImageController extends AbstractController
{
    #[Route('/upload/image', name: 'app_upload_image', methods: ['POST'])]
    public function uploadImage(Request $request): Response
    {
        $file = 'https://upload.wikimedia.org/wikipedia/commons/0/01/Charvet_shirt.jpg';
        //$file = $request->files->get('image');
        /*
        if (!$file) {
            return new Response('No file uploaded.');
        }
        */
        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
                'api_key' => $_ENV['CLOUDINARY_API_KEY'],
                'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
            ],
            'url' => [
                'scheme' => 'https',
                'secure' => true,
            ],
        ]);
        /*
        Configuration::instance([
            'cloud' => [
                'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
                'api_key' => $_ENV['CLOUDINARY_API_KEY'],
                'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
            ],
            'url' => [
                'scheme' => 'https',
                'secure' => true,
            ]
        ]);
        */
        try {
            //$result = $cloudinary->uploadApi()->upload($file, [
            $result = $cloudinary->uploadApi()->upload($file, [
                'public_id' => 'Charvet_shirt',
                'folder' => 'ShareAlbum',
                'preset' => 'ml_default',
            ]);
            print_r($result);

            $response = new Response();
            $response->setContent(json_encode([
                'message' => 'Image uploaded successfully.',
                'url' => $result['secure_url'],
            ]));
            $response->headers->set('Content-Type', 'application/json');

            return $response;

        } catch (\Exception $exception) {
            $response = new Response();
            $response->setContent(json_encode(['error' => $exception->getMessage()]));
            $response->headers->set('Content-Type', 'application/json');

            return $response;
        }
    }
}
