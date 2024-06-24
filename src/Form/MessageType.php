<?php

namespace App\Form;

use App\Entity\Message;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class MessageType extends AbstractType
{
    private $em;

    public function __construct(EntityManagerInterface $em, Security $security){
        $this->em = $em;
    }
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('recipient', EntityType::class, [
                'class' => User::class,
                'query_builder' => function(UserRepository $er) {
                    return $er->createQueryBuilder('u')
                        ->where('u.roles LIKE :role')
                        ->setParameter('role', '["ROLE_USER"]');
                },
                'choice_label' => function($value, $key, $index) {
                    if ($index === 0) {
                        return 'Cliente';
                    }
                    return $value->getFullName();
                },
                'placeholder' => 'Cliente',
            ])
            ->add('subject')
            ->add('fileUrl', FileType::class, [
                'label' => 'Elige un fichero',
                'required' => false, // Si no es obligatorio subir un archivo
            ])
            ->add('textMessage', TextareaType::class, [
                'label' => 'Mensaje',
                'required' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Message::class,
        ]);
    }
}
