<?php

namespace App\Entity;

use App\Repository\AlbumRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlbumRepository::class)]
class Album
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'album')]
    private ?Session $session = null;

    /**
     * @var Collection<int, Photos>
     */
    #[ORM\ManyToMany(targetEntity: Photos::class, inversedBy: 'album')]
    private Collection $photos;

    /**
     * @var Collection<int, Guest>
     */
    #[ORM\OneToMany(targetEntity: Guest::class, mappedBy: 'album')]
    private Collection $guest;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
        $this->guest = new ArrayCollection();
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

    public function getSession(): ?Session
    {
        return $this->session;
    }

    public function setSession(?Session $session): static
    {
        $this->session = $session;

        return $this;
    }

    /**
     * @return Collection<int, Photos>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(Photos $photo): static
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
        }

        return $this;
    }

    public function removePhoto(Photos $photo): static
    {
        $this->photos->removeElement($photo);

        return $this;
    }

    /**
     * @return Collection<int, Guest>
     */
    public function getGuest(): Collection
    {
        return $this->guest;
    }

    public function addGuest(Guest $guest): static
    {
        if (!$this->guest->contains($guest)) {
            $this->guest->add($guest);
            $guest->setAlbum($this);
        }

        return $this;
    }

    public function removeGuest(Guest $guest): static
    {
        if ($this->guest->removeElement($guest)) {
            // set the owning side to null (unless already changed)
            if ($guest->getAlbum() === $this) {
                $guest->setAlbum(null);
            }
        }

        return $this;
    }
}
