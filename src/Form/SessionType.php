<?php

namespace App\Form;

use App\Entity\Extras;
use App\Entity\Services;
use App\Entity\Session;
use App\Entity\User;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Positive;
use Symfony\Component\Validator\Constraints\Type;

class SessionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El nombre no puede estar vacío']),
                ],
            ])
            ->add('date', DateTimeType::class, [
                'widget' => 'single_text',
                'constraints' => [
                    new NotBlank(['message' => 'La fecha no puede estar vacía']),
                ],
            ])
            ->add('priceSession', MoneyType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El precio no puede estar vacío']),
                    new Type(['type' => 'numeric', 'message' => 'El precio debe ser un número']),
                    new Positive(['message' => 'El precio debe ser un número positivo']),
                ],
            ])
            ->add('descriptionSession', TextareaType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'La descripción no puede estar vacía']),
                ],
            ])
            ->add('service', EntityType::class, [
                'class' => Services::class,
                'choice_label' => 'name',
                'constraints' => [
                    new NotBlank(['message' => 'El servicio no puede estar vacío']),
                ],
            ])
            ->add('users', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'getFullName',
                'expanded' => true,
                'multiple' => true,
                'constraints' => [
                    new NotBlank(['message' => 'Debe seleccionar al menos un usuario']),
                ],
            ])
            ->add('extras', EntityType::class, [
                'class' => Extras::class,
                'choice_label' => 'name',
                'expanded' => true,
                'multiple' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Session::class,
        ]);
    }
}
