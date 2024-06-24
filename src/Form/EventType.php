<?php

namespace App\Form;

use App\Entity\Event;
use App\Entity\Services;
use App\Entity\Session;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('date', null, [
                'widget' => 'single_text',
            ])
            ->add('user', EntityType::class, [
                'class' => User::class,
                'query_builder' => function(UserRepository $er) {
                    return $er->createQueryBuilder('u')
                        ->where('u.roles LIKE :role')
                        ->setParameter('role', 'ROLE_ADMIN_USER');
                },
                'choice_label' => function($value, $key, $index) {
                    if ($index === 0) {
                        return 'Fotógrafo';
                    }
                    return $value->getFullName();
                },
                'placeholder' => 'Fotógrafo',
                'required' => false,
            ])
            ->add('services', EntityType::class, [
                'class' => Services::class,
                'choice_label' => 'name',
                'placeholder' => 'Servicio',
                'required' => false,
            ])
            ->add('session', EntityType::class, [
                'class' => Session::class,
                'choice_label' => 'name',
                'placeholder' => 'Sesión',
                'required' => false,
            ])
            ->add('comment')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Event::class,
        ]);
    }
}
