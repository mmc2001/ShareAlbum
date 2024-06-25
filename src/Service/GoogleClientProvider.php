<?php

namespace App\Service;

use Google\Client;
use Google\Service\Calendar;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
class GoogleClientProvider
{
    private $params;
    private $credentialsPath;

    public function __construct(ParameterBagInterface $params, string $googleCredentialsPath)
    {
        $this->params = $params;
        $this->credentialsPath = $googleCredentialsPath;
    }

    public function getClient(): Client
    {
        $client = new Client();
        $client->setAuthConfig($this->credentialsPath);
        $client->addScope('https://www.googleapis.com/auth/calendar');

        return $client;
    }
}