<?php

namespace App\Entity;

use App\Repository\SessionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SessionRepository::class)]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    private ?int $priceSession = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $descriptionSession = null;

    #[ORM\ManyToOne(inversedBy: 'session')]
    private ?Services $service = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'session')]
    private Collection $users;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'session')]
    private Collection $event;

    /**
     * @var Collection<int, Extras>
     */
    #[ORM\ManyToMany(targetEntity: Extras::class, mappedBy: 'session')]
    private Collection $extras;

    /**
     * @var Collection<int, Album>
     */
    #[ORM\OneToMany(targetEntity: Album::class, mappedBy: 'session')]
    private Collection $album;

    public function __construct($name = null, $date = null, $priceSession = null, $descriptionSession = null, $service = null)
    {
        $this->name = $name;
        $this->date = $date;
        $this->priceSession = $priceSession;
        $this->descriptionSession = $descriptionSession;
        $this->service = $service;
        $this->users = new ArrayCollection();
        $this->event = new ArrayCollection();
        $this->extras = new ArrayCollection();
        $this->album = new ArrayCollection();
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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getPriceSession(): ?int
    {
        return $this->priceSession;
    }

    public function setPriceSession(int $priceSession): static
    {
        $this->priceSession = $priceSession;

        return $this;
    }

    public function getDescriptionSession(): ?string
    {
        return $this->descriptionSession;
    }

    public function setDescriptionSession(?string $descriptionSession): static
    {
        $this->descriptionSession = $descriptionSession;

        return $this;
    }

    public function getService(): ?Services
    {
        return $this->service;
    }

    public function setService(?Services $service): static
    {
        $this->service = $service;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addSession($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeSession($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvent(): Collection
    {
        return $this->event;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->event->contains($event)) {
            $this->event->add($event);
            $event->setSession($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->event->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getSession() === $this) {
                $event->setSession(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Extras>
     */
    public function getExtras(): Collection
    {
        return $this->extras;
    }

    public function addExtra(Extras $extra): static
    {
        if (!$this->extras->contains($extra)) {
            $this->extras->add($extra);
            $extra->addSession($this);
        }

        return $this;
    }

    public function removeExtra(Extras $extra): static
    {
        if ($this->extras->removeElement($extra)) {
            $extra->removeSession($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Album>
     */
    public function getAlbum(): Collection
    {
        return $this->album;
    }

    public function addAlbum(Album $album): static
    {
        if (!$this->album->contains($album)) {
            $this->album->add($album);
            $album->setSession($this);
        }

        return $this;
    }

    public function removeAlbum(Album $album): static
    {
        if ($this->album->removeElement($album)) {
            // set the owning side to null (unless already changed)
            if ($album->getSession() === $this) {
                $album->setSession(null);
            }
        }

        return $this;
    }
}
