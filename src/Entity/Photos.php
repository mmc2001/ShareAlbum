<?php

namespace App\Entity;

use App\Repository\PhotosRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PhotosRepository::class)]
class Photos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $photoUrl = null;

    #[ORM\Column]
    private ?bool $hasBeenSelected = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $comment = null;

    /**
     * @var Collection<int, Album>
     */
    #[ORM\ManyToMany(targetEntity: Album::class, mappedBy: 'photos')]
    private Collection $album;

    public function __construct()
    {
        $this->album = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPhotoUrl(): ?string
    {
        return $this->photoUrl;
    }

    public function setPhotoUrl(string $photoUrl): static
    {
        $this->photoUrl = $photoUrl;

        return $this;
    }

    public function hasBeenSelected(): ?bool
    {
        return $this->hasBeenSelected;
    }

    public function setHasBeenSelected(bool $hasBeenSelected): static
    {
        $this->hasBeenSelected = $hasBeenSelected;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

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
            $album->addPhoto($this);
        }

        return $this;
    }

    public function removeAlbum(Album $album): static
    {
        if ($this->album->removeElement($album)) {
            $album->removePhoto($this);
        }

        return $this;
    }
}
