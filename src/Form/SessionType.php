<?php

namespace App\Form;

use App\Entity\Extras;
use App\Entity\Services;
use App\Entity\Session;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SessionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('date', null, [
                'widget' => 'single_text',
            ])
            ->add('priceSession')
            ->add('descriptionSession')
            ->add('service', EntityType::class, [
                'class' => Services::class,
                'choice_label' => 'id',
            ])
            ->add('users', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'getFullName',
                'multiple' => true,
            ])
            ->add('extras', EntityType::class, [
                'class' => Extras::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
            ->add('submit', SubmitType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Session::class,
        ]);
    }
}
