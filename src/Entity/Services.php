<?php

namespace App\Entity;

use App\Repository\ServicesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ServicesRepository::class)]
class Services
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $priceService = null;

    /**
     * @var Collection<int, Session>
     */
    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'service')]
    private Collection $session;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'services')]
    private Collection $eventId;

    public function __construct()
    {
        $this->session = new ArrayCollection();
        $this->eventId = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPriceService(): ?int
    {
        return $this->priceService;
    }

    public function setPriceService(int $priceService): static
    {
        $this->priceService = $priceService;

        return $this;
    }

    /**
     * @return Collection<int, Session>
     */
    public function getSession(): Collection
    {
        return $this->session;
    }

    public function addSession(Session $session): static
    {
        if (!$this->session->contains($session)) {
            $this->session->add($session);
            $session->setService($this);
        }

        return $this;
    }

    public function removeSession(Session $session): static
    {
        if ($this->session->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getService() === $this) {
                $session->setService(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEventId(): Collection
    {
        return $this->eventId;
    }

    public function addEventId(Event $eventId): static
    {
        if (!$this->eventId->contains($eventId)) {
            $this->eventId->add($eventId);
            $eventId->setServices($this);
        }

        return $this;
    }

    public function removeEventId(Event $eventId): static
    {
        if ($this->eventId->removeElement($eventId)) {
            // set the owning side to null (unless already changed)
            if ($eventId->getServices() === $this) {
                $eventId->setServices(null);
            }
        }

        return $this;
    }
}
