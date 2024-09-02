<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;

class UserDataType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El email no puede estar vacío']),
                    new Email(['message' => 'El email {{ value }} no es válido']),
                ],
            ])
            ->add('name', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El nombre no puede estar vacío']),
                ],
            ])
            ->add('surnames', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'Los apellidos no pueden estar vacíos']),
                ],
            ])
            ->add('dni', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El DNI no puede estar vacío']),
                    new Regex([
                        'pattern' => '/^[0-9]{8}[A-Z]$/',
                        'message' => 'El DNI debe tener 8 números seguidos de una letra mayúscula',
                    ]),
                ],
            ])
            ->add('telephone', TelType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El teléfono no puede estar vacío']),
                    new Length([
                        'max' => 9,
                        'maxMessage' => 'El teléfono no puede tener más de {{ limit }} dígitos',
                    ]),
                    new Regex([
                        'pattern' => '/^[0-9]+$/',
                        'message' => 'El teléfono solo puede contener números',
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}