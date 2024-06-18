<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $surnames = null;

    #[ORM\Column(length: 255)]
    private ?string $dni = null;

    #[ORM\Column]
    private ?int $telephone = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'receiverId')]
    private Collection $messageIdReceiver;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'senderId')]
    private Collection $messageIdSender;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender')]
    private Collection $messageSender;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'recipient')]
    private Collection $messageRecipient;

    /**
     * @var Collection<int, Session>
     */
    #[ORM\ManyToMany(targetEntity: Session::class, inversedBy: 'users')]
    private Collection $session;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'user')]
    private Collection $event;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $passwordExpiryDate = null;

    public function __construct()
    {
        $this->messageIdReceiver = new ArrayCollection();
        $this->messageIdSender = new ArrayCollection();
        $this->messageSender = new ArrayCollection();
        $this->messageRecipient = new ArrayCollection();
        $this->session = new ArrayCollection();
        $this->event = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getSurnames(): ?string
    {
        return $this->surnames;
    }

    public function setSurnames(string $surnames): static
    {
        $this->surnames = $surnames;

        return $this;
    }

    public function getFullName(): string
    {
        return trim("{$this->getName()} {$this->getSurnames()}");
    }

    public function getDni(): ?string
    {
        return $this->dni;
    }

    public function setDni(string $dni): static
    {
        $this->dni = $dni;

        return $this;
    }

    public function getTelephone(): ?int
    {
        return $this->telephone;
    }

    public function setTelephone(int $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessageIdReceiver(): Collection
    {
        return $this->messageIdReceiver;
    }

    public function addMessageIdReceiver(Message $messageIdReceiver): static
    {
        if (!$this->messageIdReceiver->contains($messageIdReceiver)) {
            $this->messageIdReceiver->add($messageIdReceiver);
            $messageIdReceiver->setReceiverId($this);
        }

        return $this;
    }

    public function removeMessageIdReceiver(Message $messageIdReceiver): static
    {
        if ($this->messageIdReceiver->removeElement($messageIdReceiver)) {
            // set the owning side to null (unless already changed)
            if ($messageIdReceiver->getReceiverId() === $this) {
                $messageIdReceiver->setReceiverId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessageIdSender(): Collection
    {
        return $this->messageIdSender;
    }

    public function addMessageIdSender(Message $messageIdSender): static
    {
        if (!$this->messageIdSender->contains($messageIdSender)) {
            $this->messageIdSender->add($messageIdSender);
            $messageIdSender->setSenderId($this);
        }

        return $this;
    }

    public function removeMessageIdSender(Message $messageIdSender): static
    {
        if ($this->messageIdSender->removeElement($messageIdSender)) {
            // set the owning side to null (unless already changed)
            if ($messageIdSender->getSenderId() === $this) {
                $messageIdSender->setSenderId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessageSender(): Collection
    {
        return $this->messageSender;
    }

    public function addMessageSender(Message $messageSender): static
    {
        if (!$this->messageSender->contains($messageSender)) {
            $this->messageSender->add($messageSender);
            $messageSender->setSender($this);
        }

        return $this;
    }

    public function removeMessageSender(Message $messageSender): static
    {
        if ($this->messageSender->removeElement($messageSender)) {
            // set the owning side to null (unless already changed)
            if ($messageSender->getSender() === $this) {
                $messageSender->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessageRecipient(): Collection
    {
        return $this->messageRecipient;
    }

    public function addMessageRecipient(Message $messageRecipient): static
    {
        if (!$this->messageRecipient->contains($messageRecipient)) {
            $this->messageRecipient->add($messageRecipient);
            $messageRecipient->setRecipient($this);
        }

        return $this;
    }

    public function removeMessageRecipient(Message $messageRecipient): static
    {
        if ($this->messageRecipient->removeElement($messageRecipient)) {
            // set the owning side to null (unless already changed)
            if ($messageRecipient->getRecipient() === $this) {
                $messageRecipient->setRecipient(null);
            }
        }

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
        }

        return $this;
    }

    public function removeSession(Session $session): static
    {
        $this->session->removeElement($session);

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
            $event->setUser($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->event->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getUser() === $this) {
                $event->setUser(null);
            }
        }

        return $this;
    }

    public function getPasswordExpiryDate(): ?\DateTimeInterface
    {
        return $this->passwordExpiryDate;
    }

    public function setPasswordExpiryDate(\DateTimeInterface $passwordExpiryDate): static
    {
        $this->passwordExpiryDate = $passwordExpiryDate;

        return $this;
    }

}
